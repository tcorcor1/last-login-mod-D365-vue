# last-login-mod

:construction: :construction: DISCLAIMER :construction: :construction:

March 9, 2022

Fetch XML aggregation has been restored, however, groupby clauses do not work. I was informed this is a bug and will be rectified but was also told grouping by userid/lookups may not be supported anymore. Things seem to be changing a lot with this so I plan to await the MS bugfix before deciding whether to archive this project.

Feb 9, 2022

UPDATE: Unfortunately, I have not seen a resolution to this issue after several months. As far as I know, the fix is still on the roadmap. I apologize for any inconvenience this causes you. I will report back as soon as I get more information.

Aug 13, 2021

Microsoft has recently made some architectural changes moving the audit table to a NoSQL database. During this transformational period fetch XML aggregation has been disabled on the audit table which breaks this tool. This update is being gradually rolled out to all regions and may not effect you YET but will eventually.

I have been told by MS support that this is not permanent and fetch XML aggregation on the audit table will be restored. Schedule is (tentatively) end of September 2021.

I will be sure to update when I get more information.

## Documentation

Please see the following for information on how to use this module:

<https://tldr-dynamics.com/blog/last-login-audit-module>

![Demo](https://tldr-dynamics-assets.s3.us-east-2.amazonaws.com/img/posts/last-login-audit-module_107_1.gif)
