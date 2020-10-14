<template>
  <div class="llmod-wrapper">
    <section class="llmod-api-options">
      <div>API v.<input class="api-version" v-model="apiVersion" type="text" value=""></div>
    </section>
    <section class="llmod-head">
      <div>
        <button class="button is-info" 
          v-bind:class="{ 'is-loading': isLoading }" 
          @click="getAuditData()">Fetch</button>
        <button class="button is-info" 
          :disabled="this.rows.length === 0" 
          @click="exportCsv()">Export</button>
        <button class="button is-danger" 
          @click="resetOptions()">Clear</button>
      </div>
      <div>
        <h1 class="is-size-4">Last Login Audit Report</h1>
      </div>
    </section>
    <section class="llmod-expand-options" @click="toggleSearchOptions()">Refine Search Options
      <font-awesome-icon icon="caret-down" v-if="!isExpanded" />
      <font-awesome-icon icon="caret-up" v-if="isExpanded" />
    </section>
    <section class="llmod-src-options" v-bind:class="{ 'is-expanded': isExpanded }">
      <div class="src-row">
        <div class="src-item">
          <label class="item-label">Date (after):</label>
          <input v-model="dateOnAfter" class="input" type="date">
        </div>
        <div class="src-item">
          <label class="item-label">Date (before):</label>
          <input v-model="dateOnBefore" class="input" type="date">
        </div>
        <div class="src-item">
          <label class="item-label">Business Unit:</label>
          <div class="select">
            <select id="business-units" v-model="selectedBu">
              <option value="">Any</option>
              <option v-for="(bu, index) in businessUnits" 
                :key="index" 
                :value="bu.Id">{{bu.Name}}</option>
            </select>
          </div>
        </div>
        <div class="src-item">
          <input class="input" type="text" placeholder="Search user by email address" 
            v-model="userEmail" 
            v-bind:class="{ 'is-danger': !isValidEmail }" 
            v-on:keyup="validateEmail(userEmail)"
            v-on:keyup.enter="getAuditData()">
            <font-awesome-icon class="input-icon" icon="exclamation-triangle" v-if="!isValidEmail" />
        </div>
      </div>
    </section>
    <section class="llmod-table">
      <vue-good-table
        :columns="columns"
        :rows="rows"
        :search-options="{
          enabled: true,
        }"
        :pagination-options="{
          enabled: true,
          mode: 'records',
          perPage: 100,
          nextLabel: 'next',
          prevLabel: 'prev',
          position: 'bottom'
        }">
      </vue-good-table>
    </section>
    <section class="llmod-foot">
      <a href="https://tldr-dynamics.com" target="_blank">tldr-dynamics.com</a> | <a href="https://tldr-dynamics.com/blog/last-login-audit-module" target="_blank">code &amp; documentation</a>
    </section>
  </div>
</template>

<script>
export default {
  name: 'app',
  data() {
    return {
      isLoading: false,
      isExpanded: false,
      isValidEmail: true,
      dateOnAfter: '',
      dateOnBefore: '',
      userEmail: '',
      apiVersion: '9.1',
      businessUnits: [],
      activeUsers: [],
      selectedBu: '',
      columns: [
        {
          label: 'Full Name',
          field: 'FullName',
        },
        {
          label: 'Last Login',
          field: 'LastLoginDate',
          type: 'date',
          dateInputFormat: 'MM/dd/yyyy',
          dateOutputFormat: 'yyyy-MM-dd',
        },
        {
          label: 'Email',
          field: 'DomainName',
        },
      ],
      rows: [],
    };
  },
  methods: {
    async getAuditData() {
      this.isLoading = true;
      const dateOnAfterXml = (this.dateOnAfter) ? `<condition attribute="createdon" operator="on-or-after" value="${this.dateOnAfter}" />`:'';
      const dateOnBeforeXml = (this.dateOnBefore) ? `<condition attribute="createdon" operator="on-or-before" value="${this.dateOnBefore}" />`:'';
      const userEmailXml = (this.userEmail) ? `<condition entityname="su" attribute="internalemailaddress" operator="eq" value="${this.userEmail}" />`:'';
      const businessUnitXml = (this.selectedBu) ? `<condition entityname="su" attribute="businessunitid" operator="in"><value uitype="businessunit">{${this.selectedBu}}</value></condition>`:'';
      let fetchXml = `<fetch mapping="logical" aggregate="true" version="1.0" ><entity name="audit" ><attribute name="createdon" alias="lastlogin" aggregate="max" /><filter><condition attribute="operation" operator="eq" value="4" />${dateOnAfterXml + dateOnBeforeXml}<condition entityname="su" attribute="isdisabled" operator="eq" value="0" /><condition entityname="su" attribute="accessmode" operator="not-in"><value>4</value><value>5</value></condition>${userEmailXml}${businessUnitXml}</filter><link-entity name="systemuser" from="systemuserid" to="objectid" alias="su" link-type="inner" ><attribute name="fullname" alias="fullname" groupby="true" /><attribute name="domainname" alias="domainname" groupby="true" /><attribute name="accessmode" alias="accessmode" groupby="true" /><attribute name="isdisabled" alias="isdisabled" groupby="true" /><attribute name="businessunitid" alias="businessunitid" groupby="true" /><attribute name="internalemailaddress" alias="internalemailaddress" groupby="true" /></link-entity></entity></fetch>`;
      const fetchXmlEncoded = encodeURIComponent(fetchXml);
      await fetch(`${window.location.origin}/api/data/v${this.apiVersion}/audits?fetchXml=${fetchXmlEncoded}`)
        .then(response => {
          if(response.ok) { 
            return response.json()
          } else {
            alert(`Server Response: ${response.status}\nPlease try to refine search to return smaller result by using business unit and date-range filters.`);
          }
        })
        .then(data => this.rows = this.transformAuditData(data.value))
        .then(() => this.isLoading = false)
        .catch((error) => {
          this.isLoading = false;
          throw new Error(`Last-Login-Mod: Could not successfully retrieve audit data.\n${error}`);
        }); 
    },
    transformAuditData(loadArr) {
      return loadArr.map( obj => {
        return {
          'FullName' : obj.fullname,
          'LastLoginDate' : new Date(obj.lastlogin).toLocaleDateString('en-US'),
          'DomainName' : obj.domainname.toLowerCase()
        }
      })
    },
    async getBuData() {
      await fetch(`${window.location.origin}/api/data/v${this.apiVersion}/businessunits?$select=name,businessunitid`)
        .then(response => {
          if(response.ok) { 
            return response.json()
          } else {
            alert(`Server Response: ${response.status}\nError retrieving BU data. Please refresh/try again.`);
          }
        })
        .then(data => this.businessUnits = this.transformBuData(data.value))
        .catch((error) => {
          this.isLoading = false;
          throw new Error(`Last-Login-Mod: Could not successfully retrieve BU Data.\n${error}`);
        });  
    },
    transformBuData(loadArr) {
      return loadArr.map( obj => {
        return {
          'Id' : obj.businessunitid,
          'Name' : obj.name.replace(/[^a-zA-Z0-9-|_\s]/g, '').trim()
        }
      })
    },
    async getActiveUserData() {
        await fetch(`${window.location.origin}/api/data/v${this.apiVersion}/systemusers?$select=fullname,internalemailaddress,_businessunitid_value&$filter=isdisabled ne true and accessmode ne 5 and accessmode ne 4`)
          .then(response => {
            if(response.ok) { 
              return response.json()
            } else {
              alert(`Server Response: ${response.status}\nError retrieving active user data. Please refresh/try again.`);
            }
          })
        .then(data => this.activeUsers = this.transformActiveUserData(data.value))
        .catch((error) => {
          this.isLoading = false;
          throw new Error(`Last-Login-Mod: Could not successfully retrieve active user data.\n${error}`);
        });  
    },
    transformActiveUserData(loadArr) {
      return loadArr.map( obj => {
        return {
          'DomainName' : obj.internalemailaddress.toLowerCase(),
          'FullName' : obj.fullname.replace(/[^a-zA-Z0-9-|_\s]/g, '').trim(),
          'BusinessUnit' : obj._businessunitid_value
        }
      })
    },
    exportCsv() {
      let csvResultSet = `data:text/csv;charset=utf-8,Full Name,Email,Last Login\n${this.exportArray.map( e => e.join(",")).join("\n")}`;
      let csvAbsentUsers = `\n\nActive User/s not present in time-period:\n\n${this.returnAbsentUsers()}`;
      const encodedContent = encodeURI(csvResultSet + csvAbsentUsers);
      const link = document.createElement("a");
      link.setAttribute("href", encodedContent);
      link.setAttribute("download", `LastLoginResults${this.dateOnAfter+this.dateOnBefore}.csv`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    },
    returnAbsentUsers() {
      let buUserArray;
      if (!this.selectedBu) {
        buUserArray = this.activeUsers;
      } else {
        buUserArray = this.activeUsers.filter((u) => {
          return u.BusinessUnit === this.selectedBu;
        });
      }
      let absenteeArr = buUserArray.filter((buUser) => {
        return !this.rows.some(foundUser => foundUser.DomainName === buUser.DomainName)
      });
      return absenteeArr.map( e => e.DomainName).join(`,\n`);
    },
    toggleSearchOptions() {
      this.isExpanded = !this.isExpanded;
    },
    validateEmail(email) {
      const regEx = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
      this.isValidEmail = (!email) ? true : regEx.test(String(email).toLowerCase());
    },
    resetOptions() {
      this.dateOnAfter = "";
      this.dateOnBefore = "";
      this.userEmail = "";
      this.rows = [];
    }
  },
  computed: {
    exportArray() {
      return this.rows.map(obj => [
        obj.FullName.replace(/[^a-zA-Z0-9-|_\s]/g, '').trim(), 
        obj.DomainName, 
        obj.LastLoginDate
      ]);
    },
  },
  mounted() {
    this.getBuData();
    this.getActiveUserData();
  }
};
</script>

<style>
.llmod-wrapper {
  margin: 30px;
}
.llmod-head {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin: 0px 0px 10px 0px;
}
.vgt-wrap {
  z-index: 9999;
}
.llmod-src-options {
  height: 0px;
  transition: height 0.2s ease-out;
  background-color: #f1f3f6;
}
.is-expanded {
  height: auto;
}
.src-row {
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  margin: 0px;
  width: 100%;
  justify-content: space-between;
}
.src-item {
  display: flex;
  align-items: center;
  padding: 12px;
  width: 325px;
}
.item-label {
  padding-right: 10px;
}
.input-icon {
  margin-left: 5px;
}
.button {
  margin-right: 5px;
}
select {
  width: 250px;
}
.llmod-api-options {
  display: flex;
  justify-content: flex-end;
}
.api-version {
  width: 35px;
  margin-left: 5px;
  justify-content: flex-end;
  text-align: center;
  border: none;
}
.api-version:hover {
  background-color: #f1f3f6;
}
.llmod-expand-options {
  width: 100%;
  height: auto;
  background-color: #f1f3f6;
  border: none;
  border-radius: 3px 3px 0px 0px;
  padding: 5px;
  margin: 0;
  text-align: left;
  font-size: 1em;
  cursor: pointer;
}
.llmod-expand-options:hover {
  background-color: #dcddde;
}
.llmod-foot {
  margin: 30px;
  text-align: center;
}
</style>