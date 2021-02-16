const chai = require('chai');
const chaiHttp = require('chai-http');
const expect = chai.expect;
const should = chai.should();

const baseUrl = 'http://localhost:3000';

chai.use(chaiHttp);

describe("API REST Test", () => {
  it('Server is live', (done) => {
    chai.request(baseUrl)
      .get('/')
      .end((err, res) => {
        console.log(res.body);
        expect(res).to.have.status(200);
        expect(res.body).to.have.property('message');
        expect(res.body.message).to.equal('api alive');
        done();
      });
  });
});

// describe('/POST signup user', () => {
//   it('it should POST a new user', (done) => {
//     const url = '/api/users/signup';
//     const user = {
//       firstName: "Juan",
//       lastName: "Perez",
//       username: "fede12",
//       password: "juanrepez",
//       currency: "eur"
//     };
//     chai.request(baseUrl)
//       .post(url)
//       .send(user)
//       .end((err, res) => {
//         res.should.have.status(200);
//         res.body.should.be.a('object');
//         res.body.should.have.property('response');
//         res.body.response.should.have.property('message').eql('Signup successful');
//         done();
//       });
//   });
// });

describe('Cypto API', () => {
  it('it should POST a new user and all api test', (done) => {
    console.log('-----------Create new user-------');
    const url = '/api/users/signup';
    const user = {
      firstName: "Federico",
      lastName: "Cingolani",
      username: "fcj",
      password: "fede",
      currency: "ars"
    };
    chai.request(baseUrl)
      .post(url)
      .send(user)
      .end((err, res) => {
        res.should.have.status(200);
        res.body.should.be.a('object');
        res.body.should.have.property('response');
        res.body.response.should.have.property('message').eql('Signup successful');
        console.log('-----------Login user that was created-------');
        const url2 = '/api/users/login';
        const user2 = {
          username: user.username,
          password: user.password
        };
        chai.request(baseUrl)
          .post(url2)
          .send(user2)
          .end((err, res) => {
            res.should.have.status(200);
            res.body.should.be.a('object');
            res.body.should.have.property('error').eql(null);
            res.body.should.have.property('token');
            const token = res.body.token;
            console.log('-----------Get all crypto-------');
            const url3 = '/api/coins/getAllCrypto?auth_token=' + token;
            chai.request(baseUrl)
              .get(url3)
              .end((err, res) => {
                res.should.have.status(200);
                res.body.should.be.a('object');
                done();
              });
          });
      });
  });
});