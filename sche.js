const { Auth } = require("two-step-auth");

async function login(emailId) {
  // The second parameter is optional and can be used to specify the company name
  const res = await Auth(emailId, "Company Name");

  console.log(res);
  console.log(res.mail);
  console.log(res.OTP);
  console.log(res.success);
}

login("verificationEmail@anyDomain.com");
