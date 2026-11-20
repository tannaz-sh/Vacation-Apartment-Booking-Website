import test from 'node:test';
import assert from 'node:assert/strict';
import { bookingUrl, contactSchema, filterApartments, searchFaq, type Apartment } from '../src/lib/domain.ts';
const flat: Apartment = {slug:'demo',title:'Demo',description:'Fixture',capacity:4,bedrooms:2,amenities:['WLAN'],smoobuApartmentId:null,status:'published',fixture:true};
test('filters capacity and amenities and never returns drafts',()=>{
  assert.equal(filterApartments([flat,{...flat,status:'draft'}],4,'WLAN').length,1);
  assert.equal(filterApartments([flat],5,'').length,0);
  assert.equal(filterApartments([flat],1,'Balkon').length,0);
});
test('booking requires exact HTTPS host, no credentials and no nonstandard port',()=>{
  assert.equal(bookingUrl('https://booking.example.test/engine','booking.example.test'),'https://booking.example.test/engine');
  for(const url of ['http://booking.example.test','https://booking.example.test.evil.test','https://user:password@booking.example.test','javascript:alert(1)','https://booking.example.test:8443','bad']) assert.equal(bookingUrl(url,'booking.example.test'),null);
  assert.equal(bookingUrl(undefined,'booking.example.test'),null);
  assert.equal(bookingUrl('https://booking.example.test',undefined),null);
});
test('contact requires valid fields, consent and an empty honeypot',()=>{
  const data={name:'Test Guest',email:'guest@example.test',message:'A test question about a stay.',privacy:true,website:''};
  assert.equal(contactSchema.safeParse(data).success,true);
  for(const bad of [{email:'bad'},{message:'short'},{privacy:false},{website:'spam'},{name:' '},{message:'x'.repeat(5001)}]) assert.equal(contactSchema.safeParse({...data,...bad}).success,false);
});
test('FAQ answers are approved and relevant, unknown returns empty',()=>{
  const entries=[{question:'WLAN?',answer:'Vorhanden',approved:true},{question:'Preis?',answer:'Unconfirmed rate',approved:false}];
  assert.equal(searchFaq(entries,'wlan').length,1);
  assert.equal(searchFaq(entries,'Preis').length,0);
  assert.equal(searchFaq(entries,'stornierung').length,0);
  assert.equal(searchFaq(entries,'').length,1);
});
