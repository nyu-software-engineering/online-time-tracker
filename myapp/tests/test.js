const assert = require('chai').assert;
const expect = require('chai').expect;
const extension=require('../extension/functions.js');

bgfnc =new extension();




const testUrl = 'https://stackoverflow.com/questions/1979583/how-can-i-get-the-url-of-the-current-tab-from-a-google-chrome-extension?utm_medium=organic&utm_source=google_rich_qa&utm_campaign=google_rich_qa';
const testUrl2 = 'https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/let'
const testUrl3 = 'https://shibboleth.nyu.edu/idp/profile/SAML2/Unsolicited/SSO;jsessionid=rjg1ax7u3cbhhezid4o9g7hz?execution=e1s1'



describe('getHostName', function() {

    it('should return stackoverflow', function() {
        assert.equal(bgfnc.getHostName(testUrl), 'stackoverflow');
    });

    it('should return mozilla', function() {
        assert.equal(bgfnc.getHostName(testUrl2), 'mozilla');
    })

    it('should return nyu', function() {
        assert.equal(bgfnc.getHostName(testUrl3), 'nyu');
    })

});


describe('parseTime', function() {


    it('should return correct time in hours,minutes,seconds', function() {

        let time = bgfnc.parseTime(7390000)
        expect(time['hours']).to.equal(2);
        expect(time['minutes']).to.equal(3);
        expect(time['seconds']).to.equal(10);

    })
    it('should return 0 if input is zero', function() {

        let time = bgfnc.parseTime(0);
        expect(time['hours']).to.equal(0);
        expect(time['minutes']).to.equal(0);
        expect(time['seconds']).to.equal(0);

    })

    it('should return correct time in hours,minutes,seconds if decimal points involved ', function() {

        let time = bgfnc.parseTime(57845100);
        expect(time['hours']).to.equal(16);
        expect(time['minutes']).to.equal(4);
        expect(time['seconds']).to.equal(5);

    })

})


describe('switchCurrentTab', function() {
    it('should add new domain if domain not found', function() {
        bgfnc.switchCurrentTab("https://gmail.com");
        assert.equal(bgfnc.activeURL, 'https://gmail.com');

    })
    it('should add new domain on switch', function() {
        bgfnc.switchCurrentTab("https://youtube.com");
        var keys = Object.keys(bgfnc.domains);
        assert.equal(keys[0], "https://gmail.com");
    })

})



describe('updateTime', function() {
    it('should set time to 0 if no domain found', function() {
        bgfnc.updateTime("https://stackoverflow.com");
        expect(bgfnc.domains["https://stackoverflow.com"]).to.equal(0);
    })
    it('should set time to delta time if domain is found', function() {
        bgfnc.startTime = new Date() - 100;
        bgfnc.updateTime("https://stackoverflow.com");
      
        expect(bgfnc.domains["https://stackoverflow.com"]).to.be.at.least(.100);

    })


})