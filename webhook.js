const clusterURL = 'https://some.where.on.the.web.de/k8s/clusters/c-fwnw6';
const apiVersion = 'v1';
const rancherMonitoringNamespace = 'cattle-monitoring-system';
const rancherMonitoringPort = '9090';

class Script {

    process_incoming_request({request}) {
        //console.log(request.content);

        // Return a rocket.chat message object.
        // If channel is undefined, the default channel from the webhook configuration is used
        return {
            content: {
                username: "Prometheus Alert",
                attachments: this.getAlerts(request.content),
                channel: undefined
            }
        };
    }

    getAlerts(content) {
        let alertColor = this.getAlertColor(content.status);
        let attachments = [];
        for (let i = 0; i < content.alerts.length; i++) {
            let alert = content.alerts[i];

            attachments.push({
                color: alertColor,
                title_link: this.getLinkToPrometheus(alert),
                title: this.getAlertTitle(alert),
                text: alert.annotations.message
            });
        }
        return attachments;
    }

    getAlertColor(status) {
        if (status === "resolved") {
            return "good";
        } else if (status === "firing") {
            return "danger";
        } else {
            return "warning";
        }
    }

    getAlertTitle(alert) {
        let title = "[" + alert.labels.severity.toUpperCase() + "]: " + alert.status.toUpperCase() + " ";
        if (!!alert.annotations.summary) {
            title += alert.annotations.summary;
        } else if (!!alert.labels.alertname) {
            title += alert.labels.alertname + ": " + (!!alert.labels.service ? "service/"+alert.labels.service : "pod/"+alert.labels.pod);
        }
        return title;
    }

    getLinkToPrometheus(alert) {
        let linkToRancherMonitoring = alert.generatorURL.replace(`.${rancherMonitoringNamespace}:${rancherMonitoringPort}`, `:${rancherMonitoringPort}/proxy`);
        linkToRancherMonitoring = linkToRancherMonitoring.replace('http://', '')
        linkToRancherMonitoring = linkToRancherMonitoring.replace('http://', '')

        return `${clusterURL}/api/${apiVersion}/namespaces/${alert.labels.namespace}/services/http:${linkToRancherMonitoring}`;
    }
}

////////////////////////////////////////////////////////////////////////
// DO NOT COPY THE BELOW LINES IN THE ROCKET.CHAT SCRIPT FIELD !!!!!!!!!
////////////////////////////////////////////////////////////////////////
module.exports = new Script();