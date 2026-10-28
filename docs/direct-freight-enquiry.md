# Direct freight enquiry delivery

The website form submits to `POST /api/enquiry`. It sends the collection, delivery, goods, contact and timing fields to the declared operations address `help@haul-smart.com`. The message uses the customer's validated email as Reply-To. This route does not create a booking, quote, invoice or payment.

## Runtime configuration

The project already has `EMAIL_USER` and `EMAIL_PASS` variables and includes Nodemailer. An SMTP host is not currently configured. Direct submission therefore stays disabled until the hosting project has all of these variables in the relevant environment:

- `SMTP_HOST`: verified SMTP hostname for the approved mail account.
- `SMTP_PORT`: optional; defaults to 587. Port 465 uses TLS.
- `EMAIL_USER` and `EMAIL_PASS`: existing SMTP credentials.
- `EMAIL_FROM`: optional approved sender address; defaults to `EMAIL_USER`.

Keep credentials in the hosting provider's encrypted environment settings. Configure Preview first, then verify a controlled enquiry and human receipt before adding the host to Production. The endpoint reports success only after the SMTP server accepts the declared operations recipient. An SMTP acceptance is not proof that a person read or replied to the message.

## Safeguards and limits

The route rejects invalid fields, non-JSON and cross-origin requests, includes a honeypot, caps request size, limits attempts per IP, and rejects a reused idempotency key. Rate-limit and duplicate records live in the serverless process memory and expire after one hour and ten minutes respectively. They protect retries and repeated submissions on a warm instance; they are not a cross-instance persistent store. For stronger fleet-wide abuse controls, add a durable rate-limit/idempotency store before scaling traffic or enabling high-volume campaigns.

## Candidate checks

Run `node --test lib/directEnquiry.test.js`. The tests cover SMTP success, recipient and field preservation, invalid/spam/cross-origin rejection, missing configuration, SMTP failure, retry after failure, duplicate keys and rate limiting. The tests mock SMTP and never send a real email.
