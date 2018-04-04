const app = require("../app.js");
const assert=require('chai').assert;
const expect=require('chai').expect;
const extension=require('../extension/functions.js');

const testUrl='https://stackoverflow.com/questions/1979583/how-can-i-get-the-url-of-the-current-tab-from-a-google-chrome-extension?utm_medium=organic&utm_source=google_rich_qa&utm_campaign=google_rich_qa';
const testUrl2='https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/let'
const testUrl3='https://shibboleth.nyu.edu/idp/profile/SAML2/Unsolicited/SSO;jsessionid=rjg1ax7u3cbhhezid4o9g7hz?execution=e1s1'

const chai = require('chai');
const chaiHttp = require('chai-http');
const should = chai.should();
bgfnc=new extension();
chai.use(chaiHttp);

const request = require("request")


//homepage test by zk
describe("get all tests for homepage", function(){

		//first route
    describe("GET /", function() {
        it("returns status code 200", function() {
            request.get("http://localhost:3000/", function(error, response, body) {
                assert.equal(200, response.statusCode);
                done();
            });
        });
    });

		//login route
		describe("GET /addname", function(){
        it("returns status code 200", function(){
            request.get("http://localhost:3000/addname", function(error, response, body){
                assert.equal(200, response.statusCode);
                done();
            });
        });
    });
		//login route
		describe("GET /about", function(){
				it("returns status code 200", function(){
						request.get("http://localhost:3000/about", function(error, response, body){
								assert.equal(200, response.statusCode);
								done();
						});
				});
		});

		// testing 404 route functionality by matthew tessler
		describe("GET /nonExistentPage", function() {
			it("returns status code 404", function() {
				request.get("http://localhost:3000/blahblah", function(error, response,body){
					assert.equal(404, response.statusCode);
					done();
				});
			});
		});
});


describe('getHostName',function(){

	it('should return stackoverflow',function(){
		assert.equal(bgfnc.getHostName(testUrl),'stackoverflow');
	});

	it('should return mozilla',function(){
		assert.equal(bgfnc.getHostName(testUrl2),'mozilla');
	})

	it('should return nyu',function(){
		assert.equal(bgfnc.getHostName(testUrl3),'nyu');
	})

});

describe('parseTime',function(){


	it('should return correct time in hours,minutes,seconds',function(){

		let time=bgfnc.parseTime(7390000)
		expect(time['hours']).to.equal(2);
		expect(time['minutes']).to.equal(3);
		expect(time['seconds']).to.equal(10);

	})
	it('should return 0 if input is zero',function(){

		let time=bgfnc.parseTime(0);
		expect(time['hours']).to.equal(0);
		expect(time['minutes']).to.equal(0);
		expect(time['seconds']).to.equal(0);

	})

	it('should return correct time in hours,minutes,seconds if decimal points involved ',function(){

		let time=bgfnc.parseTime(57845100);
		expect(time['hours']).to.equal(16);
		expect(time['minutes']).to.equal(4);
		expect(time['seconds']).to.equal(5);

	})

})


const testUrl4 = 'http://www.facebook.com';
const testUrl5 = 'notAUrl';

describe('parseUrl', function() {
    it('should return facebook.com', function() {
        assert.equal(bgfnc.parseUrl(testUrl4),'facebook.com');
    });
    // negative testing - testing for failure
    it('should return null', function() {
        assert.equal(bgfnc.parseUrl(testUrl5), null);
    })

});
