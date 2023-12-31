export default {
	"post": ["poster", "title", "content", "image"],
	"product": ["name", "description", "price", "quantity", "size", "barcode", "product_code", "weight", "rating"],
	"service": ["name", "description", "price", "duration", "rating"],
	"user": ["fname", "lname", "email", "password", "phone", "gender", "dob", "country", "city", "picture", "about", "address", "account_no", "occupation", "id_number", "passport", "marital_status"],
	"business": ["name", "email", "phone", "website", "logo", "country", "city", "address", "description", "slogan", "lat", "lng", "picture"],
	"house": ["name", "city", "country", "country_code", "rating", "state", "address", "lat", "lng", "picture", "ownder"],
	"payment": ["invoice_no", "status", "reference", "amount", "date_paid"],
	"order": ["product", "quantity", "discount", "vat"],
	"call": ["from", "to", "type", "status", "rating", "start", "end"],
	"category": ["title", "description", "icon"]
}