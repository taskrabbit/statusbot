# StatusBot

I check URLs and report their status to statuspage.io.  
This powers `status.taskrabbit.com`.

This tool will gather response times for your METRICS.
METRICS are linked to a COMPONENT, and will trigger the COMPONENT status as the metric changes.  For example if you have METRIC "api_user_search_response_time" and the COMPONENT "API", you can setup StatusBot to note the "API" as having an outage if your metric check for the related endpoint to "api_user_search_response_time" is either slow or does not return a `200 OK`

- If a metric check is slow (`check.threshold`), the related component is noted as `degraded performance`
- If there is an HTTP error checking the metric, the related component is noted as having a `partial_outage`
  - You configure how many times an metric must fail before the outage is triggered (default 10).
- If you don't want to create an incident for a metric, set `check.impact = 'none'` 
- StatusBot will never close an incident for you.  This should be done manually via your `statuspage.io` dashboard, so you can add incident notes. 

## Install

- `npm install`
- configure your checks in `/config/statuspage.js` (copy from `/config/statuspage.example.js`)
- `npm start`

StatusBot is an actionhero.js project. Visit [www.actionherojs.com](http://www.actionherojs.com) for more information.

## Notes

- As this is an actionhero project, you can do the following:
  - Manually run the checks with the action `check`
    - You can run this action via HTTP, Telnet, and sockets if you configure the server to enable these transports.
  - Deploy a cluster of statusBots that all share the same redis instance and all the checks will be distributed between them. 
- You can configure the frequency at which all URLs are checked within the `checkAll` task by modifying `task.frequency`.  The default is 10 seconds. 
  - To account for `statuspage.io`'s rate limiting, we will wait 5 seconds before each check within the `checkAll` task.  This is not configurable.
- You can configure the default message new incidents are created at within `/config/errors.js`

## TODO

- configure the workers so they fairly round-robin the checks between all available nodes. 
- allow for regexp-based body checks
  - these regexep checks might power the incident messaging
