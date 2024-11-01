/*
* WA Restful API utils
* @author Leomar Artiles
*/

'use strict';


const { v4: uuidv4 } = require('uuid');
const moment = require("moment");
class AppHelper{

    app_make_id(length) {
		let result = '';
		let characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
		let charactersLength = characters.length;
		for (var i = 0; i < length; i++) {
			result += characters.charAt(Math.floor(Math.random() *
				charactersLength));
		}
		return result.toUpperCase();	//return bcrypt.hashSync(password, 10);
	}

	app_get_concat_str_data(rsData,fieldId){
		let strConcat=[];
		rsData.forEach(rsItem => {
			strConcat.push(rsItem[fieldId]);
		});
		return strConcat.join(',');
	}
	app_build_filter_search(fieldsFilters){
		let queryFilter ='',queryStart=' WHERE ';
		if(fieldsFilters.location.length >0){
			queryFilter +=` WHERE country='${fieldsFilters.location}' `; queryStart=' AND ';
		}
		if( fieldsFilters.state !=undefined){
			if(fieldsFilters.state.length >0 && fieldsFilters.state != 0){
				queryFilter +=` ${queryStart} states=${fieldsFilters.state} `; queryStart=' AND ';
			}
		}
		if( fieldsFilters.city !=undefined){
			if(fieldsFilters.city.length >0 && fieldsFilters.city != 0){
				queryFilter +=` ${queryStart} city=${fieldsFilters.city} `; queryStart=' AND ';
			}
		}
		if( fieldsFilters.category !=undefined){
			if(fieldsFilters.category.length >0 && fieldsFilters.category != 0){
				queryFilter +=` ${queryStart} category=${fieldsFilters.category} `; queryStart=' AND ';
			}
		}
		if( fieldsFilters.bedrooms !=undefined){
			if(fieldsFilters.bedrooms.length >0 && fieldsFilters.bedrooms != 0){
				queryFilter +=` ${queryStart} bedrooms_qt >=${fieldsFilters.bedrooms} `; queryStart=' AND ';
			}
		}
		if( fieldsFilters.bathroom !=undefined){
			if(fieldsFilters.bathroom.length >0 && fieldsFilters.bathroom != 0){
				queryFilter +=` ${queryStart} bathrooms_qt >=${fieldsFilters.bathroom} `; queryStart=' AND ';
			}
		}
		if( fieldsFilters.price_filter !=undefined){
			if(fieldsFilters.price_start.length >0){
				queryFilter +=` ${queryStart} price >=${fieldsFilters.price_start} AND price <=${fieldsFilters.price_end} `; queryStart=' AND ';
			}
		}
		if( fieldsFilters.size_filter != undefined){
			if(fieldsFilters.size_start.length >0){
				queryFilter +=` ${queryStart} built_size >=${fieldsFilters.size_start} AND built_size <=${fieldsFilters.size_end} `; queryStart=' AND ';
			}
		}
		
		if( fieldsFilters.is_public !=undefined){
			if(fieldsFilters.is_public.length >0){
				queryFilter +=` ${queryStart} is_public=${fieldsFilters.is_public} `; queryStart=' AND ';
			}
		}
		if( fieldsFilters.is_deleted ==undefined){
			fieldsFilters.is_deleted = "0";
		}
		if(fieldsFilters.is_deleted.length >0){
			queryFilter +=` ${queryStart} is_deleted=${fieldsFilters.is_deleted} `; queryStart=' AND ';
		}
		// if(fieldsFilters.price_start.length >0){
		// 	queryFilter =` ${queryStart} price >=${fieldsFilters.price_start} AND price <=${fieldsFilters.price_end} `; queryStart=' AND ';
		// }
		return queryFilter;
	}

	app_template_landlord_welcome(itemEmail){
		return `<p>Dear ${itemEmail.user_firstname} ${itemEmail.user_lastname},</p>
		<p>On behalf of the World Association Tenant Bureau, we are excited to welcome you as one of our verified landlords! As a member, you now have the ability to post all of your rental listings on our platform for free.</p>
		
		<p>Before you can begin using our tenant rental search and posting area, we kindly ask that you complete the registration process. Once your registration is completed and approved, you&#39;ll have full access to our range of services, including the ability to post and manage your rental listings and search for potential tenants.</p>
		<p>We understand that finding quality tenants can be a time-consuming and a difficult process. That&#39;s why we have created a platform where landlords and tenants can connect quickly and easily. By joining our community, you&#39;ll be able to streamline the process of approving your tenants&#39; applications and expand your rental business.</p>
		
		<p>Our team is dedicated to providing our members with the resources they need to succeed. We offer a wealth of knowledge and experience in the rental industry, and we are always available to answer any questions or offer guidance.</p>
		<p>Thank you for joining the World Association Tenant Bureau community. We look forward to working with you and helping you achieve your rental business goals.</p>
		
		<p>&nbsp;</p>
		<p>Best regards,</p>
		<p>Staff and Agents</p>
		<p>&nbsp;</p>
		<p>The World Association Tenant Bureau Team<br />
		Toronto, Canada Office +1 (647) 846-4720</p>
		<p>The&nbsp;ONLY&nbsp;World Association Tenant Bureau. Where you search for your applicant before renting and warn other landlords of bad tenants. Let&rsquo;s work together to eliminate or greatly reduce fraudulent tenants. Let&#39;s work together and help each other &ldquo;Get to Know your Tenant&rdquo;!</p>
		<p>&nbsp;</p>
		<p>GET TO KNOW YOUR TENANT&nbsp;<a href="https://watenantbureau.com">World Association Tenant Bureau</a></p>`;
	}
	app_template_landlord_company_approved(itemEmail){
		return `<p>Dear ${itemEmail.landlord_name},</p>

		<p>We are pleased to inform you that your application has been fully approved, and you now have access to our platform&#39;s full range of services. This means that you can now search for tenants, post reviews about tenants, and connect with potential tenants from all over the world.</p>
		
		<p>As you know, the World Association Tenant Bureau is committed to providing landlords with the tools they need to make informed decisions about their rental properties. One of the most important tools at your disposal is the ability to post reviews about your previous tenants. By sharing your experiences with other landlords, you can help to build a community of trust and transparency within our platform.</p>
		
		<p>We strongly encourage you to provide both positive and negative feedback about your previous tenants. This information is invaluable to other landlords who may be considering the same tenant in the future. However, we do ask that all information be truthful and accurate to the fullest extent possible.</p>
		
		<p>At the World Association Tenant Bureau, we believe that transparency and honesty are essential to creating a thriving rental community. By working together, we can make the rental process easier, more efficient, and more rewarding for everyone involved.</p>
		
		<p>Thank you for choosing to join our community of landlords. We look forward to working with you and helping you find the perfect tenants for your properties.</p>
		
		<p>Best regards,</p>
		
		<p>The World Association Tenant Bureau team</p>`;

	}

	 app_template_landlord_noti_tenant(itemEmail){
		return `<div style="width: 805px; margin: auto 10px;">
		<p style="text-align: justify;">Subject: Tenant Application Received - Property Rental Inquiry</p>
		<p style="text-align: justify;">Dear ${itemEmail.landlordNames},</p>
		<p style="text-align: justify;">I hope this email finds you well. I am writing to inform you that a prospective tenant has submitted an application to rent your property ID#&nbsp;<strong>${itemEmail.id_reg}&nbsp;</strong> through our online portal. Log into your portal to access the application within our system.</p>
		<p style="text-align: justify;"><br />Please note that we do not conduct credit or criminal record checks on our applicants. We believe that a true rental background, including rental history and references, is the most important factor in selecting the right tenant for your property.<br /><br />The applicant has provided all the necessary information, including their personal details, employment status, and rental history. We are in the process of verifying their rental references and will update their record in our database once this verification has been completed, usually within 24-48 hrs. We understand that finding the right tenant for your property is essential, and we believe this applicant may meet your requirements. Therefore, we encourage you to review their application as soon as possible and let us know if you have any questions or concerns.<br /><br />If you are satisfied with the applicant's information, you can proceed with the next steps, which include do a search in our database, showing the property, signing the lease agreement and collecting the security deposit and first month's rent.<br /><br />Please don&rsquo;t forget to update our database if you rent to this or any applicant. This way we can keep our database base up-to-date.<br /><br />Please let us know if you have any questions or if you would like to&nbsp; discuss any details regarding the property or the application.</p>
		<p style="text-align: justify;">&nbsp;</p>
		<p style="text-align: justify;">Best regards,<br />Staff<br />World Association Tenant Bureau</p>
		</div>`;
	}

	app_template_tenant_noti_completed_ra(itemEmail){
		return `<div style="width: 805px; margin: auto 10px;">
		<p style="text-align: justify;">Subject: Thank You for Completing the Rental Application</p>
		<p style="text-align: justify;">Dear ${itemEmail.user_firstname} ${itemEmail.user_lastname},</p>
		<p class="p1" style="text-align: justify;">I wanted to take a moment to express our appreciation for your prompt completion of the rental application. We are pleased to inform you that your application has been successfully forwarded to the landlord and they will be in touch with you once your application has been verified.</p>
		<p class="p1" style="text-align: justify;">As promised, we have unlocked the landlord's contact information, Now you can also search for any other landlord&rsquo;s information you might be interested in. You can now conveniently send your application to any landlord who&rsquo;s contact information you request.</p>
		<p class="p1" style="text-align: justify;">We want to reassure you that your information is safe with us. We do not sell or give away any database information other then for future landlords to search and verify your rental history. We understand that privacy and confidentiality are important to you, and we respect that.</p>
		<p class="p1" style="text-align: justify;">Once again, thank you for your application. Please don't hesitate to contact us if you have any questions or concerns. We are always here to help.</p>
		<p style="text-align: justify;">Best regards,<br />Staff<br />World Association Tenant Bureau</p>
		</div>`;
	}
	app_template_user_password(itemEmail,UrlResetPassword){
		return `<div style="width: 805px; margin: auto 10px;">
		<p style="text-align: justify;">Subject: Password Change Request - Link Enclosed</p>
		<p style="text-align: justify;">Dear ${itemEmail.user_firstname} ${itemEmail.user_lastname},</p>
		<p class="p1" style="text-align: justify;">We hope this email finds you well. We received a request to change your password on our platform, and we want to ensure that your account remains secure at all times. As requested, we have provided a link below that will allow you to reset your password quickly and easily.<br/> <a href="${UrlResetPassword}">Please click here to reset your password.</a></p>
		<p class="p1" style="text-align: justify;">To ensure your account remains secure, we recommend that you create a unique and strong password that includes a mix of upper and lowercase letters, numbers, and symbols. Additionally, it's important to keep your password safe and avoid sharing it with anyone</p>
		<p class="p1" style="text-align: justify;">If you did not initiate this request, please contact us immediately to prevent any unauthorized access to your account. We take the security of our users very seriously and will do everything we can to ensure the protection of your account.</p>
		<p class="p1" style="text-align: justify;">Thank you for your prompt attention to this matter. If you have any questions or concerns, please do not hesitate to reach out to us.</p>
		<p style="text-align: justify;">Best regards,<br/>Staff<br />World Association Tenant Bureau</p>
		</div>`;
	}
}

module.exports = new AppHelper();