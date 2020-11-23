# Rocket.Chat Integration for Prometheus Alertmanager by Rancher Monitoring System

A Rocket.Chat webhook integration that creates concise messages from Prometheus Alertmananager alerts generated
by th the [Rancher](https://rancher.com/) Monitoring System (c.f. https://rancher.com/docs/rancher/v2.x/en/monitoring-alerting/v2.5/).

See https://rocket.chat/docs/administrator-guides/integrations/ for details on how to generate Rocket.Chat webhooks.

## Message Format

Rocket.Chat messages produced by this webhook will have the following basic format (based on the keys in the [Alertmanager request](sample-request.json)):

    [labels.severity OR status] annotations.summary | labels.alertname
    annotations.message

## Installation

### Rocket.Chat

1. Login as admin user and go to: Administration => Integrations => New Integration => Incoming WebHook
2. Set "Enabled" and "Script Enabled" to "True".
3. Set channel, icons, etc. as you need.
4. Modify the constants at the top of `webhook.js` to fit your cluster.
```
const clusterURL = 'https://some.where.on.the.web.de/k8s/clusters/c-fwnw6';
const apiVersion = 'v1';
const rancherMonitoringNamespace = 'cattle-monitoring-system';
const rancherMonitoringPort = '9090';
```
5. Paste the contents of `webhook.js` into the Script field. Be aware not to paste the `module.exports = new Script();` 
line. It is only needed for testing.


Create Integration. Copy the WebHook URL and proceed to Alertmanager.

### Prometheus Alertmanager

Create a new receiver or modify config of existing one. You'll need to add `webhooks_config` to it. Small example:

    route:
      receiver: rocketchat

    receivers:
      - name: rocketchat
        webhook_configs:
          - send_resolved: true
            url: '${WEBHOOK_URL}'

Reload/restart Alertmanager.

## Testing

Some Jasmine unit tests exist using the `sample-request.json` as test data. Execute them running: `npm test`.

To test the webhook, you may send a sample request to your Rocket.Chat instance:

    curl -X POST -H 'Content-Type: application/json' --data-binary @sample-request.json [webhook-url]

## License

The rancher-prometheus-alertmanager-rocket-chat is released under the terms of the MIT License.
It was forked from [prometheus-rocket-chat](https://github.com/puzzle/prometheus-rocket-chat)
with correspondence to its license we mention the copyright of 2019-2020 Puzzle ITC GmbH here.
See `LICENSE` for further information.
