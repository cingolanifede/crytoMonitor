const chai = require('chai');
const chaiHttp = require('chai-http');
const expect = chai.expect;
const should = chai.should();

const baseUrl = 'http://localhost:8080';

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

describe('Cypto API', () => {
  it('it should POST a new user and all api test', (done) => {
    console.log('Create new user-------');
    const url = '/api/users/register';
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
        console.log(res.body);
        console.log(' ');
        console.log('Login user-------');
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
            res.body.should.have.property('data');
            res.body.data.should.have.property('token');
            console.log(res.body);
            console.log(' ');
            const token = res.body.data.token;
            console.log('Get user info -------');
            const url3 = '/api/users/' + user2.username;
            chai.request(baseUrl)
              .get(url3)
              .set('Authorization', 'Bearer ' + token)
              .end((err, res) => {
                res.should.have.status(200);
                res.body.should.be.a('object');
                console.log(res.body);
                console.log(' ');

                console.log('Add new coin to user -------');
                const url4 = '/api/coins/add/' + user2.username;
                const coin = {
                  crypto: "0chain",
                  symbol: "zcn",
                  name: "0chain"
                };
                chai.request(baseUrl)
                  .post(url4)
                  .set('Authorization', 'Bearer ' + token)
                  .send(coin)
                  .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.be.a('object');
                    res.body.should.have.property('message').eql('Coin added');
                    console.log(res.body);
                    console.log(' ');

                    console.log('Get top N user currency and order descendent -------');
                    const url5 = '/api/coins/topN/' + user2.username + '?desc=true&n=3';
                    chai.request(baseUrl)
                      .get(url5)
                      .set('Authorization', 'Bearer ' + token)
                      .end((err, res) => {
                        res.should.have.status(200);
                        res.body.should.be.a('array');
                        res.body[0].should.have.property('symbol');
                        res.body[0].should.have.property('name');
                        res.body[0].should.have.property('image');
                        res.body[0].should.have.property('last_updated');
                        res.body[0].should.have.property('currency');
                        console.log(res.body);
                        console.log(' ');
                        done();
                      });
                  });
              });
          });
      });
  });
});