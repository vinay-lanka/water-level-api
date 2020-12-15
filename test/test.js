// Import the dependencies
var chai = require('chai')
var chaiHttp = require('chai-http')
// Import the application to test
var app = require('../server')
// Configure Chai
chai.use(chaiHttp)
chai.should()

describe('Homepage', () => {
    it('should show the Hello World message', done => {
        chai
        .request(app)
        .get('/')
        .end((err, res) => {
            res.text.should.equal('hello')
            done()
        })
    })
})

describe('Status', () => {
    it('should show the value and percentage status', done => {
      chai
        .request(app)
        .get('/status')
        .end((err, res) => {
            res.should.have.status(200);
            res.body.should.be.a('object');
            res.body.should.have.property('value');
            res.body.should.have.property('percentage');
            res.body.should.have.property('value').eql('0');
            res.body.should.have.property('percentage').eql(100);
          done()
        })
    })
})

describe('Toggle Status', () => {
    it('should show the toggle status', done => {
      chai
        .request(app)
        .get('/togglestatus')
        .end((err, res) => {
            res.should.have.status(200);
            res.body.should.be.a('object');
            res.body.should.have.property('toggle');
            res.body.should.have.property('toggle').eql('0');
          done()
        })
    })
})