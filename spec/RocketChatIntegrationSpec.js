describe("RocketChat", function() {


  beforeEach(function() {
    testClass = require('../webhook');
    testdata = {};
    testdata.request = {};
    testdata.request.content = require('../sample-request.json');
  });

  it("username should eqaul 'Prometheus Alert'", function() {
    const result = testClass.process_incoming_request(testdata);
    expect(result.content.username).toEqual("Prometheus Alert");
  });

  it("alert has color 'danger'", function() {
    const result = testClass.process_incoming_request(testdata);
    const firstAttachment = result.content.attachments[0];
    expect(firstAttachment.color).toEqual("danger");
  });

  it("title is correctly set", function() {
    const result = testClass.process_incoming_request(testdata);
    const firstAttachment = result.content.attachments[0];
    expect(firstAttachment.title).toContain("[WARNING]");
    expect(firstAttachment.title).toContain("FIRING TargetDown");
    expect(firstAttachment.title).toContain("service/pushprox-kube-controller-manager-client");
  });

  it("message is correctly set", function() {
    const result = testClass.process_incoming_request(testdata);
    const firstAttachment = result.content.attachments[0];
    expect(firstAttachment.text).toEqual("100% of the kube-controller-manager/pushprox-kube-controller-manager-client targets in cattle-monitoring-system namespace are down.");
  });

  it("channel is empty", function() {
    const result = testClass.process_incoming_request(testdata);
    expect(result.content.channel).toEqual(undefined);
  });


  it("tile link to be correct", function() {
    const result = testClass.process_incoming_request(testdata);
    const firstAttachment = result.content.attachments[0];
    expect(firstAttachment.title_link).toEqual("https://some.where.on.the.web.de/k8s/clusters/c-fwnw6/api/v1/namespaces/cattle-monitoring-system/services/http:rancher-monitoring-prometheus:9090/proxy/graph?g0.expr=100+%2A+%28count+by%28job%2C+namespace%2C+service%29+%28up+%3D%3D+0%29+%2F+count+by%28job%2C+namespace%2C+service%29+%28up%29%29+%3E+10&g0.tab=1");
  });

  it("title is correctly set for CPU Throtteling resolved message", function() {
    const result = testClass.process_incoming_request(testdata);
    const attachment = result.content.attachments[1];
    expect(attachment.title).toContain("[INFO]");
    expect(attachment.title).toContain("RESOLVED CPUThrottlingHigh");
    expect(attachment.title).toContain("pod/rancher-monitoring-prometheus-node-exporter-qptjt");
  });

  it("title is correctly set for CPU Throtteling firing message", function() {
    const result = testClass.process_incoming_request(testdata);
    const attachment = result.content.attachments[2];
    expect(attachment.title).toContain("[INFO]");
    expect(attachment.title).toContain("FIRING CPUThrottlingHigh");
    expect(attachment.title).toContain("pod/rancher-monitoring-prometheus-node-exporter-r57r5");
  });

});
