from twilio.rest import Client

account_sid = 'AC73bbc2645229b27048dbf30eba0eedb7'
auth_token = '6331a58a70418e9b4fc81ebd98a2f7da'
client = Client(account_sid, auth_token)

body = "Hola bb"

message = client.messages.create(
  from_='whatsapp:+14155238886',
  body=body,
  to='whatsapp:+593958905131'
)

print(message.sid)


#const accountSid = 'AC73bbc2645229b27048dbf30eba0eedb7';
#const authToken = '6331a58a70418e9b4fc81ebd98a2f7da';
#const client = require('twilio')(accountSid, authToken);

#client.messages
#    .create({
#        body: 'Your Twilio code is 1238432',
#        from: 'whatsapp:+14155238886',
#        to: 'whatsapp:+593958905131'
#    })
#    .then(message => console.log(message.sid))
#    .done();