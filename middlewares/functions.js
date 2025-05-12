const speakeasy = require("speakeasy");
const crypto = require("crypto");
const geoip = require('geoip-lite');
const https = require("https");
const stripHtml = require("string-strip-html");
var WAValidator = require('multicoin-address-validator');
const { OAuth2Client } = require('google-auth-library');
const client = new OAuth2Client(["711166287297-iv0cthtlc44mn1m3e9slr37t0vbu7ake.apps.googleusercontent.com", "711166287297-jl29bisrqivmml3216a0dpe064nl03c4.apps.googleusercontent.com"]);
var querystring = require('querystring');
const axios = require("axios");


module.exports = function () {
	this.callbackresponse = function (err, data) {
		if (err) console.error(err);
		else console.log(data);
	};
	this.sendtelegrampush = function (telegramchatid, message, callback) {
		console.error(message);
		const data1 = "chat_id=" + telegramchatid + "&migrate_to_chat_id=" + telegramchatid + "&text=" + message + this.urlencodestring(" \n\n" + printStackTrace());
		const options = {
			hostname: "api.telegram.org",
			port: 443,
			path: "/bot1176080672:6618452255:AAEc0LMJRmY-smfHAQ_kOqF8JJ52htunVWM/sendMessage",
			method: "POST",
			headers: {
				"Content-Type": "application/x-www-form-urlencoded",
				"Content-Length": data1.length,
			},
		};
		var body = "";
		const req = https.request(options, (res) => {
			res.on("data", (d) => {
				body += d;
			});
			res.on("end", function () {
				var _jsondata = JSON.parse(body);
				console.log(body);
				if (_jsondata.ok) callback(null, "success");
				else callback(_jsondata, null);
			});
		});
		req.on("error", (error) => {
			console.error(error);
			callback(0, 0);
		});
		req.write(data1);
		req.end();
	};
	this.filterJsonWebToken = function (webtoken) {
		if (isNull(webtoken)) return webtoken;
		if (webtoken == "") return "";
		return webtoken.replace(/[^a-zA-Z0-9-./_]/g, "");
	};
	this.isNull = function (data) {
		if (data == null || data == undefined) return true;
		return false;
	};
	this.isEmpty = function (string) {
		//console.log(typeof string);
		if (isNull(string)) return true;
		else if ((typeof string) == "object") { return Object.keys(string).length == 0 ? true : false; }
		else if ((typeof string) == "boolean") return false;
		else if ((typeof string) == "number") return false;
		else if (Array.isArray(string)) { string.length == 0 ? true : false; }
		else if (string.trim() === "") return true;
		else return false;
	};
	this.isEmptyOrNull = function (data) {
		return this.isEmpty(data) ? this.isEmpty(data) : this.isNull(data);
	};
	this.getipfromRequest = function (req) {
		if (!req || !req.headers) {
			console.error("Invalid request object"); // Debugging log
			return "";
		}
		const forwardedFor = req.headers['x-forwarded-for'];
		if (!forwardedFor) return "";
		return forwardedFor.split(",")[0].trim();
	};

	this.getipfromsocket = function (socket) {
		//console.log(socket.handshake.headers);
		if (!Array.isArray(socket.handshake.headers)) {
			return socket.handshake.headers["x-forwarded-for"].split(",")[0];
		} else {
			if (socket.handshake.headers.indexOf("X-Forwarded-For") == -1)
				return "notreference";
			return socket.handshake.headers["x-forwarded-for"].split(",")[0];
		}
	};
	this.printStackTrace = function () {
		const error = new Error();
		const stack = error.stack
			.split("\n")
			.slice(2, 20)
			.filter((obj) => {
				return obj.indexOf("node_modules") < 0;
			})
			.filter((obj) => {
				return obj.indexOf("internal/") < 0;
			})
			.map((line) => line.replace(/\s+at\s+/, ""))
			.slice(1)
			.join("\n");
		return stack;
	};

	this.getemailtemplateofproject = function (subject, content, phishingcode, username = "User") {
		var mailinfo = `<head>
		<meta http-equiv="Content-Type" content="text/html; charset=utf-8">
		<link href="https://fonts.googleapis.com/css2?family=Poppins:wght@400;500&display=swap" rel="stylesheet">
		<style>
			body {
				padding: 0px;
				margin: 0px;
				font-family: 'Poppins', sans-serif;
				font-size: 18px;
				font-size: 16px;
				background-color: #e9e9e9;
				max-width: 720px;
				margin: auto;
			}
			table,tr,th,td {
				padding-top: 0px;
				padding-bottom: 0px;
				padding-left: 0px;
				padding-right: 0px
			}
			p {
				padding: 0px;
				margin: 0px
			}
		</style>
	</head>
	<body>
		<div>
			<table cellpadding="0" cellspacing="0" border="0" width="720px" align="center">
				<tbody>
					<tr>
						<td style="background-color:#fbfbfb">
							<table height="280px" width="100%" align="center" cellpadding="0" cellspacing="0">
								<tbody>
									<tr>
										<td><img src="https://myaltpay.fra1.cdn.digitaloceanspaces.com/email/banner-left.png" height="306px" alt="img"></td>
										<td>
											<table width="408px">
												<tbody>
													<tr height="37">
														<td></td>
													</tr>
													<tr height="34" align="center">
														<td><img src="https://myaltpay.fra1.cdn.digitaloceanspaces.com/email/logo.png" alt="img"></td>
													</tr>
													<tr height="34">
														<td></td>
													</tr>
													<tr height="44">
														<td align="center" style="font-size:24px;font-weight:500">Manage all your crypto and fiat assets easily</td>
													</tr>
													<tr height="17">
														<td></td>
													</tr>
													<tr height="23">
														<td></td>
													</tr>
													<tr height="40">
														<td align="center"><a href="https://beta.myaltpay.com/" target="_blank"  style="background:#77ffb9;padding:15px 35px;text-align:center;font-size:16px;color:#000;text-decoration:none;border-radius:5px;font-weight:500" rel="noreferrer">Get Started </a></td>
													</tr>
													<tr height="13">
														<td></td>
													</tr>
												</tbody>
											</table>
										</td>
										<td><img src="https://myaltpay.fra1.cdn.digitaloceanspaces.com/email/banner-right.png" height="306px" alt="img"></td>
									</tr>
								</tbody>
							</table>
						</td>
					</tr>`;
		if (phishingcode != null && phishingcode != "") {
			mailinfo = mailinfo + `<tr>
						<td>
							<table align="center" width="100%" cellpadding="0" cellspacing="0" border="0" style="background: #fff; padding-right: 15px; line-height: 30px; font-size: 15px;">
								<tbody>
									<tr>
										<td>
											<div style="min-width: 310px; max-width: 700px; border: 1px solid #ddd6ec; float: right; border-radius: 6px; height: 36px; margin-top: 10px; line-height: 20px;">
												<div style="display: inline-block; font-family: system-ui; padding: 7px 7px 0px 7px; font-size: 15px; border-radius: 4px 0px 0px 4px; font-weight: 600; height: 30px; color: #5c3c9c; background: #ddd6ec;">
													<img src="https://myaltpay.fra1.cdn.digitaloceanspaces.com/email/pin-code.png" height="24px" alt="img" class="CToWUd" data-bit="iit" /> <span style="margin-left: 8px; vertical-align: top;">Antipishing Code:</span>
												</div>
												<div style="display: inline-block; padding: 8px 6px 0px 8px; font-size: 20px; font-weight: 600; height: 40px; color: #5c3d99; margin-left: 4px; vertical-align: top; letter-spacing: 2px;">${phishingcode}</div>
											</div>
										</td>
									</tr>
								</tbody>
							</table>
						</td>
					</tr>`;
		}
		mailinfo = mailinfo + `<tr>
					<td style="background-color:#fff">
						<table align="center" width="680px" cellpadding="0" cellspacing="0" border="0" style="padding-bottom:30px;line-height:30px;font-size:15px">
							<tbody>
								<tr>
									<td style="padding-top:20px">
										<h3 >${subject}</h3>
									</td>
								</tr>
								<tr height="30px">
									<td style="font-size:16px;">Hi <b>${username}</b>,</td>
								</tr>
								<tr height="20px">
									<td>
										<p style="line-height:15px">${content}</p>
									</td>
								</tr>
								<tr height="20px">
									<td style="padding-top:40px"><b>For other information on the login process refer to this link below:</b></td>
								</tr>
								<tr>
									<td><a href="https://beta.myaltpay.com/contactus" target="_blank" style="color: #8358d4;">Contact support</a></td>
								</tr>
							</tbody>
						</table>
					</td>
				</tr>
				<tr>
					<td>
						<table width="100%" style="background-color:#f7f7f7;text-align:center;font-size:12px"
							align="center">
							<tbody>
								<tr>
									<td style="padding-top:20px;font-size:24px"><b>Stay connected!</b></td>
								</tr>
								<tr>
									<td style="padding-top:20px;margin-bottom:30px">
										<p style="width:20px;height:20px;display:inline;padding-left:5px;padding-right:5px">
											<a href="https://beta.myaltpay.com/" rel="noreferrer"  target="_blank"><img src="https://myaltpay.fra1.cdn.digitaloceanspaces.com/email/telegram.png" height="20px" alt="img"></a>
										</p>
										<p style="width:20px;height:20px;display:inline;padding-left:5px;padding-right:5px">
											<a href="https://beta.myaltpay.com/" rel="noreferrer"  target="_blank"><img src="https://myaltpay.fra1.cdn.digitaloceanspaces.com/email/twitter.png" height="20px" alt="img"></a>
										</p>
										<p style="width:20px;height:20px;display:inline;padding-left:5px;padding-right:5px">
											<a href="https://beta.myaltpay.com/" rel="noreferrer"  target="_blank"><img src="https://myaltpay.fra1.cdn.digitaloceanspaces.com/email/linkedin.png" height="20px" alt="img"></a>
										</p>
										<p style="width:20px;height:20px;display:inline;padding-left:5px;padding-right:5px">
											<a href="https://beta.myaltpay.com/" rel="noreferrer"  target="_blank"><img src="https://myaltpay.fra1.cdn.digitaloceanspaces.com/email/socialmedia1.png" height="20px" alt="img"></a>
										</p>
									</td>
								</tr>
								<tr>
									<td><img src="https://myaltpay.fra1.cdn.digitaloceanspaces.com/email/hr.png" height="37px" alt="img" style="width:60%;margin:0px auto;height:1px"></td>
								</tr>
								<tr>
									<td style="padding-top:10px;font-size:18px">Never miss an update with the Myaltpay app</td>
								</tr>
								<tr>
									<td style="padding-top:20px">
										<p style="width:40px;height:40px;display:inline;padding-left:10px;padding-right:10px">
											<img src="https://myaltpay.fra1.cdn.digitaloceanspaces.com/email/icon-playstore.png" height="37px" alt="img">
										</p>
										<p style="width:40px;height:40px;display:inline;padding-left:10px;padding-right:10px">
											<img src="https://myaltpay.fra1.cdn.digitaloceanspaces.com/email/icon-applystore.png" height="37px" alt="img">
										</p>
									</td>
								</tr>
								<tr>
									<td style="padding-top:20px">
										<a href="https://beta.myaltpay.com/" style="color:#000;text-decoration:none" rel="noreferrer"  target="_blank">Help</a>
										| <a href="https://beta.myaltpay.com/" style="color:#000;text-decoration:none"
											rel="noreferrer">Privacy </a>
										| <a href="https://beta.myaltpay.com/" style="color:#000;text-decoration:none" rel="noreferrer"  target="_blank">Reset
											password </a>
									</td>
								</tr>
								<tr>
									<td style="padding-top:10px">We send this email to @myaltpay.
										<a href="https://beta.myaltpay.com/"  target="_blank" style="color:#000;text-decoration:underline" rel="noreferrer">Unsubscribe</a>
									</td>
								</tr>
								<tr>
									<td style="padding-top:10px"></td>
								</tr>
							</tbody>
						</table>
					</td>
				</tr>
				<tr style="background-color:#f7f7f7;">
					<td>
						<table width="680px" style="background-color:#f7f7f7;font-size:12px;padding-bottom: 30px;line-height: 22px;font-size: 15px;margin: auto;" >
							<tbody>
								<tr>
									<td style="padding-top:20px;font-size:12px"><b>Risk warning:</b>
										Digital asset prices can be volatile
										The risk of loss in trading or holding digital assets can be substantial. You
										should therefore carefully consider whether
										trading is suitable for you in light of your financial condition. Digital assets
										are not fiat money nor fiat currency. Digital
										assets are NOT backed by any government or central bank.</td>
								</tr>
								<tr>
									<td style="padding-top:20px;font-size:12px">
										<b>Disclaimer:</b> Crypto products are unregulated and can be highly risky.
										Myaltpay is only responsible for the digital asset
										transaction process on the Platform,There may be no regulatory recourse for any
										loss from such transactions.
									</td>
								</tr>
							</tbody>
						</table>
					</td>
				</tr>
			</tbody>
		</table>
		</div>
		</body>`;
		return mailinfo;
	};

	this.getOtpEmailTemplate = function (customerName, message) {
		return `
		<!DOCTYPE html>
		<html lang="en">
		<head>
			<meta charset="UTF-8">
			<meta name="viewport" content="width=device-width, initial-scale=1.0">
			<title>Email Verification</title>
			<style>
				body {
					font-family: Arial, sans-serif;
					background-color: #f9f9f9;
					margin: 0;
					padding: 20px;
				}
				.email-container {
					background-color: #ffffff;
					padding: 20px;
					border-radius: 10px;
					max-width: 600px;
					margin: auto;
					box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
				}
				.email-header {
					text-align: center;
					margin-bottom: 20px;
				}
				.email-header h1 {
					color: #2c3e50;
					font-size: 24px;
					margin: 0;
				}
				.email-body {
					line-height: 1.6;
					color: #4a4a4a;
					font-size: 16px;
				}
				.email-body p {
					margin: 10px 0;
				}
				.email-footer {
					margin-top: 30px;
					font-size: 12px;
					color: #7f8c8d;
					text-align: center;
				}
				.email-footer p {
					margin: 5px 0;
				}
				a {
					color: #3498db;
					text-decoration: none;
				}
				a:hover {
					text-decoration: underline;
				}
			</style>
		</head>
		<body>
	
			<div class="email-container">
				<div class="email-header">
					<h1>KRB Metaldetectors</h1>
				</div>
				<div class="email-body">
					<p>Dear ${customerName},</p>
					<p>Welcome to <strong>KRB Metaldetectors</strong>! We're excited to have you on board.</p>
					<p>To complete your registration and verify your email address, please click the button below:</p>
					<div style="text-align: center;">
						${message}
					</div>
					<p>If you didn’t sign up for KRB Metaldetectors, please disregard this email or contact our support team immediately.</p>
				</div>
	
				<div class="email-footer">
					<p>Need help? Contact us at <a href="mailto:krbmetaldetectors@gmail.com">krbmetaldetectors@gmail.com</a>.</p>
					<p>&copy; 2024 krbmetaldetectors@gmail.com. All rights reserved.</p>
				</div>
			</div>
	
		</body>
		</html>
		`;
	};

	this.getContactFormEmailTemplate = function (customerName, customerEmail, customerPhone, customerMessage) {
		return `
		<!DOCTYPE html>
		<html lang="en">
		<head>
			<meta charset="UTF-8">
			<meta name="viewport" content="width=device-width, initial-scale=1.0">
			<title>New Contact Form Submission</title>
			<style>
				body {
					font-family: Arial, sans-serif;
					background-color: #f9f9f9;
					margin: 0;
					padding: 20px;
				}
				.email-container {
					background-color: #ffffff;
					padding: 20px;
					border-radius: 10px;
					max-width: 600px;
					margin: auto;
					box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
				}
				.email-header {
					text-align: center;
					margin-bottom: 20px;
				}
				.email-header h1 {
					color: #d9534f;
					font-size: 24px;
					margin: 0;
				}
				.email-body {
					line-height: 1.6;
					color: #4a4a4a;
					font-size: 16px;
				}
				.email-body p {
					margin: 10px 0;
				}
				.info-box {
					background: #f9f9f9;
					padding: 15px;
					border-left: 4px solid #d9534f;
					margin-top: 10px;
					font-size: 15px;
				}
				.email-footer {
					margin-top: 30px;
					font-size: 12px;
					color: #7f8c8d;
					text-align: center;
				}
				.email-footer p {
					margin: 5px 0;
				}
				a {
					color: #3498db;
					text-decoration: none;
				}
				a:hover {
					text-decoration: underline;
				}
			</style>
		</head>
		<body>
	  
			<div class="email-container">
				<div class="email-header">
					<h1>📩 New Contact Form Submission</h1>
				</div>
				<div class="email-body">
					<p><strong>Dear CEO,</strong></p>
					<p>A new contact form has been submitted on the <strong>KRB Metaldetectors</strong> website. Below are the details:</p>
					
					<div class="info-box">
						<p><strong>📌 Name:</strong> ${customerName}</p>
						<p><strong>📧 Email:</strong> ${customerEmail}</p>
						<p><strong>📞 Phone:</strong> ${customerPhone}</p>
						<p><strong>💬 Message:</strong></p>
						<blockquote>"${customerMessage}"</blockquote>
					</div>
	
					<p>Please review and take the necessary action.</p>
				</div>
	  
				<div class="email-footer">
					<p>Need help? Contact us at <a href="mailto:krbmetaldetectors@gmail.com">krbmetaldetectors@gmail.com</a>.</p>
					<p>&copy; 2024 krbmetaldetectors@gmail.com. All rights reserved.</p>
				</div>
			</div>
	  
		</body>
		</html>
		`;
	};


	this.getForgotPasswordEmailTemplate = function (customerName, message) {
		return `
		<!DOCTYPE html>
		<html lang="en">
		<head>
			<meta charset="UTF-8">
			<meta name="viewport" content="width=device-width, initial-scale=1.0">
			<title>Forgot Password Request</title>
			<style>
				body {
					font-family: Arial, sans-serif;
					background-color: #f9f9f9;
					margin: 0;
					padding: 20px;
				}
				.email-container {
					background-color: #ffffff;
					padding: 20px;
					border-radius: 10px;
					max-width: 600px;
					margin: auto;
					box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
				}
				.email-header {
					text-align: center;
					margin-bottom: 20px;
				}
				.email-header h1 {
					color: #2c3e50;
					font-size: 24px;
					margin: 0;
				}
				.email-body {
					line-height: 1.6;
					color: #4a4a4a;
					font-size: 16px;
				}
				.email-body p {
					margin: 10px 0;
				}
				.email-footer {
					margin-top: 30px;
					font-size: 12px;
					color: #7f8c8d;
					text-align: center;
				}
				.email-footer p {
					margin: 5px 0;
				}
				a {
					color: #3498db;
					text-decoration: none;
				}
				a:hover {
					text-decoration: underline;
				}
			</style>
		</head>
		<body>
	  
			<div class="email-container">
				<div class="email-header">
					<h1>KRB Metaldetectors</h1>
				</div>
				<div class="email-body">
					<p>Dear ${customerName},</p>
					<p>We received a request to reset your password for your account at <strong>KRB Metaldetectors</strong>.</p>
					<p>If you made this request, please click the button below to reset your password:</p>
					<div style="text-align: center;">
						${message}
					</div>
					<p>If you didn’t request a password reset, please disregard this email or contact our support team immediately.</p>
				</div>
	  
				<div class="email-footer">
					<p>Need help? Contact us at <a href="mailto:krbmetaldetectors@gmail.com">krbmetaldetectors@gmail.com</a>.</p>
					<p>&copy; 2024 krbmetaldetectors@gmail.com. All rights reserved.</p>
				</div>
			</div>
	  
		</body>
		</html>
		`;
	};

	this.getdeviceinfo = function (req) {
		let _str = "";
		if (req.rawHeaders.indexOf("user-agent") == -1) return "empty";
		let _info = req.rawHeaders[req.rawHeaders.indexOf("user-agent") + 1];
		// console.log(_info);
		if (_info.indexOf("(") == -1 || _info.indexOf(")") == -1) return "";
		let _dev = _info.substring(_info.indexOf("("), _info.indexOf(")"));
		let _as = _dev.split(";");
		if (_as[0].indexOf("Windows") >= 0) {
			//windows
			if (_info.match(/chrome|chromium|crios/i)) {
				_str = "Windows chrome";
			} else if (_info.match(/firefox|fxios/i)) {
				_str = "Windows firefox";
			} else if (_info.match(/safari/i)) {
				_str = "Windows safari";
			} else if (_info.match(/opr\//i)) {
				_str = "Windows opera";
			} else if (_info.match(/edg/i)) {
				_str = "Windows edge";
			} else {
				_str = "Windows Unknown Browser";
			}
		} else if (_as[0].indexOf("Macintosh") >= 0) {
			//mac
			if (_info.match(/chrome|Chrome|chromium|crios/i)) {
				_str = "Macintosh chrome";
			} else if (_info.match(/firefox|fxios|Firefox/i)) {
				_str = "Macintosh firefox";
			} else if (_info.match(/safari/i)) {
				_str = "Macintosh safari";
			} else if (_info.match(/opr\//i)) {
				_str = "Macintosh opera";
			} else if (_info.match(/edg/i)) {
				_str = "Macintosh edge";
			} else {
				_str = "Macintosh Unknown Browser";
			}
		} else if (_info.indexOf("Android") >= 0) {
			//android mobiles
			if (_as.length < 2) {
				console.error(_info);
				//console.error(_as.length);
				return "";
			} else if (_as.length == 2) {
				if (_info.match(/chrome|Chrome|chromium|crios/i)) {
					_str = "Android chrome";
				} else if (_info.match(/firefox|fxios|Firefox/i)) {
					_str = "Android firefox";
				} else if (_info.match(/safari/i)) {
					_str = "Android safari";
				} else if (_info.match(/opr\//i)) {
					_str = "Android opera";
				} else if (_info.match(/edg/i)) {
					_str = "Android edge";
				} else {
					_str = "Android Unknown Browser";
				}
				return _str;
			} else {
				_str = _as[2];
				if (_str.indexOf("Build") != -1)
					_str = _str.substring(0, _str.indexOf("Build")).trim();
				else _str = _str.trim();
			}
		} else if (_as[0].indexOf("Linux") >= 0 || _as[1].indexOf("Linux") >= 0) {
			//Linux system
			if (_info.match(/chrome|Chrome|chromium|crios/i)) {
				_str = "Linux chrome";
			} else if (_info.match(/firefox|fxios|Firefox/i)) {
				_str = "Linux firefox";
			} else if (_info.match(/safari/i)) {
				_str = "Linux safari";
			} else if (_info.match(/opr\//i)) {
				_str = "Linux opera";
			} else if (_info.match(/edg/i)) {
				_str = "Linux edge";
			} else {
				_str = "Linux Unknown Browser";
			}
		} else if (_as[0].indexOf("iPhone") >= 0) {
			//iphone
			_str = "iPhone";
		} else {
			if (_as.length <= 2) {
				console.error(_info);
				return "";
			}
			_str = _as[2];
			if (_str.indexOf("Build") != -1)
				_str = _str.substring(0, _str.indexOf("Build")).trim();
			else _str = _str.trim();
		}
		//console.error(" samplee ",_str);
		return _str;
	};
	this.mobileAndTabletCheck = function (req) {
		let a = req.rawHeaders[req.rawHeaders.indexOf("user-agent") + 1];
		const toMatch = [
			/Android/i,
			/webOS/i,
			/iPhone/i,
			/iPad/i,
			/iPod/i,
			/BlackBerry/i,
			/Windows Phone/i
		];
		return toMatch.some((toMatchItem) => {
			return a.match(toMatchItem);
		});
	};
	this.isMD5 = function (inputString) {
		return /[a-fA-F0-9]{32}/.test(inputString);
	};
	this.toTitleCase = function (str) {
		return str.replace(/\w\S*/g, function (txt) {
			return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
		});
	};
	this.maskcode = function (data, limiter) {
		if (this.isEmptyOrNull(data) || this.isEmptyOrNull(limiter)) return "";
		let index = 0;
		if (data.length <= 1) return data;
		if (data.length <= 4) index = 1;
		else if (data.length <= 7) index = 2;
		else if (data.length <= 10) index = 3;
		else index = 4;
		return data.substr(0, index) + limiter.repeat(Math.min(Math.abs(data.length - index * 2), 5)) + data.substr(-1 * index);
	};
	this.replaceAll = function (textstring, replacefrom, replaceto) {
		if (isNull(textstring)) return textstring;
		return textstring.split(replacefrom).join(replaceto);
	};

	this.validateEmail = function email(str) {
		const match = ["yopmail.com", "temp.com"];
		var domain = str.substring(str.lastIndexOf("@") + 1);
		const data = match.includes(domain);
		var re = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,8})+$/;
		if (str == "" || !re.test(str) || data) {
			return false;
		} else {
			return true;
		}
	};
	this.deleteall = function () {
		fs.readdir(getcauchepath(), (err, files) => {
			if (err) throw err;
			for (const file of files) {
				//console.log(file);
				//console.log(file.indexOf("userorders_"));
				if (file.indexOf("userorders_") == 0)
					fs.unlink(getcauchepath() + file, function () { });
				else if (file.indexOf("usertrade_") == 0)
					fs.unlink(getcauchepath() + file, function () { });
				else if (file.indexOf("tradehistory_") == 0)
					fs.unlink(getcauchepath() + file, function () { });
				else if (file.indexOf("tradeviewsession_") == 0)
					fs.unlink(getcauchepath() + file, function () { });
				else {
				}
			}
		});
	};
	this.validatePassword = function (a) {
		if (a.length < 7) {
			return false;
		} else {
			var lowerCaseLetters = /[a-z]/g;
			var upperCaseLetters = /[A-Z]/g;
			var specialLetters = /[!@#$%^&*()]/g;
			var numbers = /[0-9]/g;
			if (!a.match(lowerCaseLetters)) {
				return false;
			} else if (!a.match(upperCaseLetters)) {
				return false;
			} else if (!a.match(numbers)) {
				return false;
			} else if (!a.match(specialLetters)) {
				return false;
			} else if (a.length < 8) {
				return false;
			} else return true;
		}
	};
	this.getdomain = function (a) {
		var domain = a.replace(/.*@/, "");
		return domain;
	};
	this.getiptolocation = function (ip) {

		var geo = geoip.lookup(ip);
		if (isNull(geo)) return "";
		return (((cleartext(geo.city) == geo.city) && (geo.city != "")) ? geo.city + ", " : "") + (((cleartext(geo.region) == geo.region) && (geo.region != "")) ? geo.region + ", " : "") + (((cleartext(geo.country) == geo.country) && (geo.country != "")) ? geo.country + ", " : "");

	}
	this.sendmobilepush = function (
		message,
		group = urlencodestring(getwebsiteName())
	) {
		//const data1="title="+urlencodestring(getwebsiteName())+"&message="+message;
		const data1 = "title=" + group + "&message=" + message;
		const options = {
			hostname: "pushserver.shivaapps.in",
			port: 80,
			path: "/sendpush.php",
			method: "POST",
			headers: {
				"Content-Type": "application/x-www-form-urlencoded",
				"Content-Length": data1.length,
			},
		};
		const req = http.request(options, (res) => {
			//console.log(`statusCode: ${res.statusCode}`);
			res.on("data", (d) => {
				process.stdout.write(d);
			});
		});
		req.on("error", (error) => {
			console.error(error);
		});
		req.write(data1);
		req.end();
	};
	this.containsspecialcharacters = function (data) {
		if (isNull(data)) return true;
		var _array = getlistofexceptioncharacters();
		for (_loopvar = 0; _loopvar < _array.length; _loopvar++) {
			if (
				(data + "").toLowerCase().indexOf(_array[_loopvar].toLowerCase()) >= 0
			)
				return false;
		}
		return true;
	};
	this.notifyadmin = function (message, mobileflag, emailflag) {
		//console.log(" in notify admin ");
		if (mobileflag) {
			sendmobilepush(message);
		}
		if (emailflag) {
			sendemail(getAdminMail(), "Admin info", message);
		}
	};
	/*
		BSC - XS24V7UN2Z2ME72U2C3D2Z75UJM1V8KVXE
		ETH- HU8VGI2A5S2RBVTXXWDBN6N6QRG28CSZBS
		matic- K6XCNCRPPFMYD9RH72E8Y6J6YRQ62PWAHF
		tronGrid- 3118c7d2-e33d-453f-b9e2-2243ba0ab275
		solscan.io- eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJjcmVhdGVkQXQiOjE2ODc0Mzg0MjM2MDYsImVtYWlsIjoiYXBpQHNoYXJrbGFzZXJzLmNvbSIsImFjdGlvbiI6InRva2VuLWFwaSIsImlhdCI6MTY4NzQzODQyM30.BqYa-Ak-ITyM4gSC696vMvm10tVNIQjBjpnEpB_e9yU
		cronoscan.com- Y26VU1AK8XV5Z1SUK637YTN3HQKGA17TNN
		gnosisscan.io-  XC23FQMPR5S5EX447KCY2626MNV3BYK3PI
		snowtrace.io - DKTSQU9DYVCB5INT1665G8DYUDNCX5HB1J
		explorer.kava.io- no login
		exporer.celo.org- no login
		arbiscan.io -  QN6YMZ2F71FEV5W683WUSRAW2ZQXF9XGPE
		arroarascan.dev- no login
	*/
	this.getCompleteinfofromRPC = function (code) {
		if (isNaN(code)) {
			console.error("getCompleteinfofromRPC", code);
			return null;
		}
		else {
			switch (Number(code)) {
				case 1:
					return { ticker: "ETH", host: "68.183.24.75", rpc: "https://rpc.ankr.com/eth", explorer: "https://etherscan.io/token/", txninfo: "https://etherscan.io/tx/", fee: 0.0015, Name: "ETHEREUM CHAIN", port: 7999, chainindex: 2, apiexplorer: "https://api.etherscan.com/api?module=account&action=tokentx&page=1&offset=5&startblock=0&endblock=999999999&sort=desc", apikeys: ["HU8VGI2A5S2RBVTXXWDBN6N6QRG28CSZBS"] };
				case 8:
					return { ticker: "TRON", host: "68.183.24.75", rpc: "", explorer: "https://tronscan.org/#/token20/", txninfo: "https://tronscan.org/#/transaction/", fee: 20, Name: "Tron", port: 4991, chainindex: 8, apiexplorer: "https://apilist.tronscanapi.com/api/new/token_trc20/transfers?limit=10&start=0&sort=-timestamp&count=true&filterTokenValue=0" };
				case 16:
					return { ticker: "SOL", host: "165.22.180.43", rpc: "", explorer: "https://solscan.io/token/", txninfo: "https://solscan.io/tx/", fee: 10, Name: "Solano", port: 4983, chainindex: 16 };
				case 25:
					return { ticker: "CORS", host: "68.183.24.75", rpc: "https://node.croswap.com/rpc", explorer: "https://cronoscan.com/token/", txninfo: "https://cronoscan.com/tx/", fee: 2, Name: "Cronos Mainnet Beta", port: 7999, chainindex: 2 };
				case 56:
					return { ticker: "BSC", host: "68.183.24.75", rpc: "https://bscrpc.com", explorer: "https://bscscan.com/token/", txninfo: "https://bscscan.com/tx/", fee: 0.005, Name: "BINANCE SMART CHAIN", port: 7999, chainindex: 2, apiexplorer: "https://api.bscscan.com/api?module=account&action=tokentx&page=1&offset=5&startblock=0&endblock=999999999&sort=desc", apikeys: ["XS24V7UN2Z2ME72U2C3D2Z75UJM1V8KVXE"] };
				case 97:
					return { ticker: "BSCTEST", host: "68.183.24.75", rpc: "https://data-seed-prebsc-1-s1.binance.org:8545/", explorer: "https://testnet.bscscan.com/token/", txninfo: "https://testnet.bscscan.com/tx/", fee: 0.005, Name: "BINANCE Test net", port: 7999, chainindex: 2, apiexplorer: "https://api-testnet.bscscan.com/api?module=account&action=tokentx&page=1&offset=5&startblock=0&endblock=999999999&sort=desc", apikeys: ["XS24V7UN2Z2ME72U2C3D2Z75UJM1V8KVXE"] };
				case 100:
					return { ticker: "GNS", host: "68.183.24.75", rpc: "https://rpc.ankr.com/gnosis", explorer: "https://gnosisscan.io/token/", txninfo: "https://gnosisscan.io/tx/", fee: 0.005, Name: "GNOSIS CHAIN", port: 7999, chainindex: 2 };
				case 137:
					return { ticker: "MATIC", host: "68.183.24.75", rpc: "https://polygon-rpc.com", explorer: "https://polygonscan.com/token/", txninfo: "https://polygonscan.com/tx/", fee: 0.05, Name: "POLYGON MATIC CHAIN", port: 7999, chainindex: 2, apiexplorer: "https://api.polygonscan.com/api?module=account&action=tokentx&page=1&offset=5&startblock=0&endblock=999999999&sort=desc", apikeys: ["K6XCNCRPPFMYD9RH72E8Y6J6YRQ62PWAHF"] };
				case 250:
					return { ticker: "FTM", host: "68.183.24.75", rpc: "https://rpc3.fantom.network", explorer: "https://snowtrace.io/token/", txninfo: "https://snowtrace.io/tx/", fee: 0.3, Name: "Avalanche C-Chain", port: 7999, chainindex: 2, apiexplorer: "https://api.snowtrace.io/api?module=account&action=tokentx&page=1&offset=5&startblock=0&endblock=999999999&sort=desc" };
				case 2222:
					return { ticker: "KAVA", host: "68.183.24.75", rpc: "https://evm.kava.io", explorer: "https://explorer.kava.io/token/", txninfo: "https://explorer.kava.io/tx/", fee: 0.3, Name: "Kava EVM", port: 7999, chainindex: 2 };
				case 42220:
					return { ticker: "CELO", host: "68.183.24.75", rpc: "https://rpc.ankr.com/celo", explorer: "https://explorer.celo.org/mainnet/token/", txninfo: "https://explorer.celo.org/mainnet/tx/", fee: 0.3, Name: "Celo Mainnet", port: 7999, chainindex: 2 };
				case 42161:
					return { ticker: "ARB", host: "68.183.24.75", rpc: "https://rpc.ankr.com/arbitrum", explorer: "https://arbiscan.io/token/", txninfo: "https://arbiscan.io/tx/", fee: 0.3, Name: "Arbitrum One", port: 7999, chainindex: 2 };
				case 1313161554:
					return { ticker: "AUR", host: "68.183.24.75", rpc: "https://mainnet.aurora.dev", explorer: "https://aurorascan.dev/token/", txninfo: "https://aurorascan.dev/tx/", fee: 0.3, Name: "Arbitrum One", port: 7999, chainindex: 2 };
				default:
					console.log(code);
					sendtelegrampush("5540170932", "Invalid ticker received as " + code, callbackresponse);
					return null;
			}
		}
	};
	this.generatehash = function (a) {
		var hash = crypto.createHash("sha1");
		data = hash.update(a, "utf-8");
		gen_hash = data.digest("hex");
		return gen_hash;
	};
	this.randomIntFromInterval = function (min, max) {
		return Math.floor(Math.random() * (max - min + 1) + min);
	};
	this.getvaluebetween = function (min, max, decimal) {
		var precision = 1;
		for (var i = 0; i < decimal; i++) precision = precision * 10;
		max = max * precision;
		min = min * precision;
		return Math.floor(Math.random() * (max - min + 1) + min) / precision;
	};
	this.getvaluebetweennew = function (min, max, decimal) {
		var precision = 1;
		for (var i = 0; i < decimal; i++) precision = precision * 10;
		return (Math.floor(Math.random() * (max * precision - (min + 1) * precision) + min * precision) / precision);
	};
	this.urlencodestring = function (query) {
		return encodeURIComponent(query).replace(/'/g, "%27").replace(/"/g, "%22");
	};
	this.generateGauthkey = function () {
		var secret = speakeasy.generateSecret({
			length: 20,
		});
		//console.log(secret.base32);
		return secret.base32;
	};
	this.getmobileauthImage = function (provider, name, secret) {
		//console.error("getmobileauthImage "+provider+" "+name+" "+secret)
		var urlencoded = urlencodestring("otpauth://totp/" + name + "?secret=" + secret + "&issuer=" + urlencodestring(provider) + "");
		return ("https://chart.googleapis.com/chart?chs=200x200&chld=M|0&cht=qr&chl=" + urlencoded + "");
	};

	this.validatemobileotp = function (key, password) {
		var tokenValidates = speakeasy.totp.verify({
			secret: key,
			encoding: "base32",
			token: password,
			window: 4,
		});
		var delta = -1;
		if (tokenValidates == true) delta = 1;
		//console.error("validatemobileotp "+tokenValidates);
		return { delta: delta };
	};
	this.validatevendor = function (a) {
		var re = /^[0-9a-zA-Z]{1,12}$/;
		if (a == "" || !re.test(a)) {
			return false;
		} else return true;
	};
	this.validateaddress = function (address, vendor) {
		return WAValidator.validate(address, vendor) ? true : false;
	}
	this.getHash = function (string, key) {
		const hash = crypto.createHmac("sha512", key).update(string).digest("hex");
		return hash;
	};
	this.MystripFunction = function (data) {
		var type = typeof data;
		//console.log(type);
		if (isNull(data)) {
			return data;
		} else if (type == "boolean") {
			return data;
		} else if (type == "number") {
			return data;
		} else if (type == "string") {
			//return stripHtml(data).result;
			return removenonAscii(stripHtml(data).result).trim();
		} else if (Array.isArray(data)) {
			for (var _loopvar = 0; _loopvar < data.length; _loopvar++) {
				data[_loopvar] = MystripFunction(data[_loopvar]);
			}
			return data;
		} else if (type == "object") {
			//console.log(data);
			for (var key in data) {
				var value = MystripFunction(data[key]);
				data[key] = value;
				//console.log(key+"  "+value);
			}
			return data;
		} else {
			console.error("MystripFunction " + type);
			console.error(data);
			// return stripHtml(data.toString()).result;
			return data;
		}
	};
	this.httpresponsetotext = (code) => {
		var friendlyHttpStatus = {
			'0': 'Unknown',
			'100': 'Continue',
			'101': 'Switching Protocols',
			'102': 'Processing',
			'200': 'OK',
			'201': 'Created',
			'202': 'Accepted',
			'203': 'Non-Authoritative Information',
			'204': 'No Content',
			'205': 'Reset Content',
			'206': 'Partial Content',
			'300': 'Multiple Choices',
			'301': 'Moved Permanently',
			'302': 'Found',
			'303': 'See Other',
			'304': 'Not Modified',
			'305': 'Use Proxy',
			'306': 'Unused',
			'307': 'Temporary Redirect',
			'400': 'Bad Request',
			'401': 'Unauthorized',
			'402': 'Payment Required',
			'403': 'Forbidden',
			'404': 'Not Found',
			'405': 'Method Not Allowed',
			'406': 'Not Acceptable',
			'407': 'Proxy Authentication Required',
			'408': 'Request Timeout',
			'409': 'Conflict',
			'410': 'Gone',
			'411': 'Length Required',
			'412': 'Precondition Required',
			'413': 'Request Entry Too Large',
			'414': 'Request-URI Too Long',
			'415': 'Unsupported Media Type',
			'416': 'Requested Range Not Satisfiable',
			'417': 'Expectation Failed',
			'418': 'I\'m a teapot',
			'429': 'Too Many Requests',
			'500': 'Internal Server Error',
			'501': 'Not Implemented',
			'502': 'Bad Gateway',
			'503': 'Service Unavailable',
			'504': 'Gateway Timeout',
			'505': 'HTTP Version Not Supported',
		};
		return isNull(friendlyHttpStatus[code]) ? "Unknown" : friendlyHttpStatus[code];
	}
	this.isUrl = (string) => {
		var protocolAndDomainRE = /^(?:\w+:)?\/\/(\S+)$/;
		var localhostDomainRE = /^localhost[\:?\d](?:[^\:?\d]\S)?$/
		var nonLocalhostDomainRE = /^[^\s\.]+\.\S{2,}$/;
		if (typeof string !== 'string') {
			return false;
		}
		var match = string.match(protocolAndDomainRE);
		if (!match) {
			return false;
		}
		var everythingAfterProtocol = match[1];
		if (!everythingAfterProtocol) {
			return false;
		}
		if (localhostDomainRE.test(everythingAfterProtocol) ||
			nonLocalhostDomainRE.test(everythingAfterProtocol)) {
			return true;
		}
		return false;
	}

	this.strip_tags = function (str) {
		if (isNull(str)) return str;
		else if (Array.isArray(str)) {
			for (var _loopvar = 0; _loopvar < str.length; _loopvar++) {
				str[_loopvar] = strip_tags(str[_loopvar]);
			}
			return str;
		} else {
			str = MystripFunction(str.toString());
			return MystripFunction(str.replace(/<\/?[^>]+>/gi, ""));
		}
	};
	this.getGoogleProfile = function (gid, callback) {
		if (isNull(gid)) {
			callback({ message: "Invalid id passed" }, null);
		}
		else {
			client.verifyIdToken({
				idToken: gid,
				audience: ["711166287297-iv0cthtlc44mn1m3e9slr37t0vbu7ake.apps.googleusercontent.com", "711166287297-jl29bisrqivmml3216a0dpe064nl03c4.apps.googleusercontent.com"]
			}).then((ticket) => {
				const payload = ticket.getPayload();
				//const userid = payload['sub'];
				// console.log(userid);
				// console.log(payload);
				callback(null, payload);
			}).catch((err) => { callback(err, null); })
		}
	};
	this.getLinkedInProfile = async function (token, callback) {
		if (isNull(token)) {
			callback({ message: "Invalid id passed" }, null);
		}
		else {
			// get an access token from linkedin API
			const result = await axios.post("https://www.linkedin.com/oauth/v2/accessToken", querystring.stringify({
				grant_type: "authorization_code",
				code: token,
				redirect_uri: LINKEDIN_REDIRECT_URL,
				client_id: LINKEDIN_CLIENT_ID,
				client_secret: LINKEDIN_CLIENT_SECRET
			}));
			const accessToken = result.data.access_token;
			// get user profile with the access token
			const profile = await axios.get('https://api.linkedin.com/v2/me',
				{
					headers: {
						'Authorization': `Bearer ${accessToken}`,
						'cache-control': 'no-cache',
						'X-Restli-Protocol-Version': '2.0.0'
					}
				});

			callback(null, profile);
		}
	};
	this.getFacebookProfile = async function (code, callback) {
		if (isNull(code)) {
			callback({ message: "Invalid id passed" }, null);
		}
		else {
			console.log("debug token", code);
			// get an access token from linkedin API
			const { data } = await axios({
				url: 'https://graph.facebook.com/v4.0/oauth/access_token',
				method: 'get',
				params: {
					client_id: process.env.FACEBOOK_APP_ID,
					client_secret: process.env.FACEBOOK_APP_SECRET,
					redirect_uri: process.env.FACEBOOK_REDIRECT_URL,
					code,
				},
			});
			const accessToken = data.access_token;
			console.log("accessToken", accessToken);
			// get user profile with the access token
			const profile = await axios({
				url: 'https://graph.facebook.com/me',
				method: 'get',
				params: {
					fields: ['id', 'email', 'first_name', 'last_name'].join(','),
					access_token: accessToken,
				},
			});

			callback(null, profile);
		}
	};
	this.customencrypt = function (str) {
		var cipher = crypto.createCipheriv('aes256', Buffer.alloc(32).fill(0), Buffer.alloc(16).fill(0));
		return cipher.update(str.toString(), 'utf8', 'hex') + cipher.final('hex');
	};
	this.customdecrypt = function (str) {
		if (isNull(str)) return str;
		try {
			var decipher = crypto.createDecipheriv('aes256', Buffer.alloc(32).fill(0), Buffer.alloc(16).fill(0));
			return decipher.update(str.toString(), 'hex', 'utf8') + decipher.final('utf8');
		}
		catch (e) {
			console.error(str);
			console.error(e);
			return "";
		}
	};
	this.isJson = function (item) {
		item = typeof item !== "string" ? JSON.stringify(item) : item;
		try {
			item = JSON.parse(item);
		} catch (e) {
			return false;
		}
		if (typeof item === "object" && item !== null) {
			return true;
		}
		return false;
	};
	this.sortjson = function (data) {
		var type = typeof data;
		if (data == null) {
			return data;
		} else if (type == 'boolean') {
			return data;
		} else if (type == 'number') {
			return data;
		} else if (type == 'string') {
			return data;
		} else if (Array.isArray(data)) {
			var res = [];
			for (var _loopvar = 0; _loopvar < data.length; _loopvar++) {
				res[_loopvar] = this.sortjson(data[_loopvar]);
			}
			return res;
		}
		else if (type == 'object') {
			var keys = Object.keys(data);
			var keyarr = keys.sort();
			var res = {}
			for (var i = 0; i < keyarr.length; i++) {
				var value = this.sortjson(data[keyarr[i]]);
				res[keyarr[i]] = value;
			}
			return res;
		} else {
			console.error("sortjson " + type);
			console.error(data);
			return data;
		}
	};
	this.encryptresponse = function (str_golb) {
		var type = typeof str_golb;
		if (isJson(str_golb)) {
			try {
				str_golb = JSON.stringify(sortjson(str_golb));
			} catch (e) {
				console.log(str_golb);
				console.error(e);
			}
		}
		else if (type == "object") {
			str_golb = JSON.stringify(
				sortjson(str_golb)
			);
		}
		let unescapeStr = urlencodestring(str_golb);
		return crypto
			.createHmac("sha512", "")
			.update(unescapeStr)
			.digest("hex")
			.toString();
	};
	this.encryptresponseupdated = function (str_golb) {
		//let unescapeStr = querystring.unescape(str);
		if (isJson(str_golb)) {
			try {
				var str = JSON.stringify(JSON.parse(str_golb));
				str_golb = str;
			} catch (e) {
				console.log(str_golb);
				console.error(e);
			}
		}
		let unescapeStr = urlencodestring(str_golb);
		return crypto
			.createHmac("sha512", "")
			.update(unescapeStr)
			.digest("hex")
			.toString();
	};
	this.getlowerlimit = function () {
		var d = new Date();
		var n = d.getHours();
		var globlowerlimit = lowerlimitarray[d.getDay()] * 1000;
		var globhigherlimit = lowerlimitarray[d.getDay() + 1] * 1000;
		var slot = (globhigherlimit - globlowerlimit) / 24;
		return Math.min(
			Math.round(globlowerlimit + slot * n),
			Math.round(globlowerlimit + slot * (n + 1))
		);
	};
	this.getnumberfixeddecimal = function (number, decimals, nodots = false) {
		if (isNaN(Number(number))) {
			return number;
		} else if (decimals < 16) {
			return removeexponentials(truncateToDecimals(number, decimals));
		} else if (nodots) {
			return removeexponentials(truncateToDecimals(number, decimals));
		} else {
			number = removeexponentials(number);
			return (
				(number + "").substring(0, 4) +
				"..." +
				(number + "").substring((number + "").length - 3)
			);
		}
	};
	this.removeexponentials = function (n) {
		var sign = +n < 0 ? "-" : "",
			toStr = n.toString();
		if (!/e/i.test(toStr)) {
			return n;
		}
		var [lead, decimal, pow] = n.toString().replace(/^-/, "").replace(/^([0-9]+)(e.*)/, "$1.$2").split(/e|\./);
		return +pow < 0 ? sign + "0." + "0".repeat(Math.max(Math.abs(pow) - 1 || 0, 0)) + lead + decimal : sign + lead + (+pow >= decimal.length ? decimal + "0".repeat(Math.max(+pow - decimal.length || 0, 0)) : decimal.slice(0, +pow) + "." + decimal.slice(+pow));
	};
	this.truncateToDecimals = function (num, fixed = 0) {
		num = removeexponentials(num);
		var re = new RegExp("^-?\\d+(?:.\\d{0," + (fixed || -1) + "})?");
		return num.toString().match(re)[0];
	};
	this.cleartext = function (string) {
		if (isNull(string)) return string;
		return string.replace(/[^\x00-\xFF]/g, "").replace(/\W/g, "");
	};
	this.removenonAscii = function (string) {
		if (string != null) return string.replace(/[^\x00-\x7F]/g, "");
		else return string;
	};
	this.countDecimals = function (value) {
		if (isNaN(value)) return 0;
		value = removeexponentials(value);
		if (Math.floor(value) === value) return 0;
		return value.toString().split(".")[1].length || 0;
	};
	this.sendmobilenotifications = function (user, title, message = "") {
		if (user != null && user != "") {
			const registrationToken = Array.isArray(user) ? user : [user];
			const options = { priority: "high", timeToLive: 60 * 60 * 24 };
			console.error(registrationToken, title);
			GFCM.messaging()
				.sendToDevice(
					registrationToken,
					{
						notification: {
							title: title,
							body: message,
						},
					},
					options
				)
				.then((response) => {
					console.log("Notification sent successfully");
				})
				.catch((error) => {
					console.trace(error);
				});
		} else {
			console.log(" null push id received for push notifications");
		}
	};
	this.validateIP = function (ipaddreess) {
		var expression = /((^\s*((([0-9]|[1-9][0-9]|1[0-9]{2}|2[0-4][0-9]|25[0-5])\.){3}([0-9]|[1-9][0-9]|1[0-9]{2}|2[0-4][0-9]|25[0-5]))\s*$)|(^\s*((([0-9A-Fa-f]{1,4}:){7}([0-9A-Fa-f]{1,4}|:))|(([0-9A-Fa-f]{1,4}:){6}(:[0-9A-Fa-f]{1,4}|((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3})|:))|(([0-9A-Fa-f]{1,4}:){5}(((:[0-9A-Fa-f]{1,4}){1,2})|:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3})|:))|(([0-9A-Fa-f]{1,4}:){4}(((:[0-9A-Fa-f]{1,4}){1,3})|((:[0-9A-Fa-f]{1,4})?:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}))|:))|(([0-9A-Fa-f]{1,4}:){3}(((:[0-9A-Fa-f]{1,4}){1,4})|((:[0-9A-Fa-f]{1,4}){0,2}:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}))|:))|(([0-9A-Fa-f]{1,4}:){2}(((:[0-9A-Fa-f]{1,4}){1,5})|((:[0-9A-Fa-f]{1,4}){0,3}:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}))|:))|(([0-9A-Fa-f]{1,4}:){1}(((:[0-9A-Fa-f]{1,4}){1,6})|((:[0-9A-Fa-f]{1,4}){0,4}:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}))|:))|(:(((:[0-9A-Fa-f]{1,4}){1,7})|((:[0-9A-Fa-f]{1,4}){0,5}:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}))|:)))(%.+)?\s*$))/;
		if (expression.test(ipaddreess)) {
			return true;
		}
		else {
			return false;
		}
	};
	this.validateMultipleIp = function (ipaddreessString) {
		if (this.isNull(ipaddreessString)) return false;
		if (this.isEmpty(ipaddreessString)) return true;
		var _iparray = ipaddreessString.split(";");
		var _status = null;
		_iparray.forEach(ipaddress => {
			_status = (_status == null) ? validateIP(ipaddress) : (_status && validateIP(ipaddress));
		});
		return _status;
	};
	this.checkipallowed = function (ipstring, requestid) {
		if (ipstring == '')
			return true;
		else {
			var iplist = ipstring.split(";");
			if (iplist.indexOf(requestid.split(",")[0].trim()) >= 0)
				//if(iplist.indexOf(requestid)>=0)
				return true;
			else
				return false;
		}
	};
	this.getSign = function (str, secret) {
		let unescapeStr = querystring.unescape(str);
		return crypto.createHmac('sha512', secret).update(unescapeStr).digest('hex').toString();
	};
	this.setResponse = function (req, res, body) {
		req._response = body;
		//res.setHeader("responseheader", encryptresponse(body));
		res.json(body);
	}
};
