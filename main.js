const modal = document.querySelector(".modal_background");
//modal.addEventListener("click", () => {
//modal.classList.add("hide");
//})

const btn = document.querySelector(".ticket");
btn.addEventListener("click", () => {
	modal.classList.add("hide");
})


window.addEventListener("DOMContentLoaded", getData);

function getData() {
	//look for and store URL parameters in the variable urlParams
	const urlParams = new URLSearchParams(window.location.search);
	//console.log(urlParams);


	const search = urlParams.get("search");
	const id = urlParams.get("id");
	const category = urlParams.get("category");

	if (search) {
		//alert("hey");
		console.log("this is searching")
		getSearchData();
	} else if (id) {
		console.log("hi mom")
		getSingleBook();
	} else if (category) {
		// category stuff
		console.log("you should be category")
		getCategoryData(category);
	} else {
		console.log("Not searching")
		getFrontpageData();
	}
	getNaviagtion();
}

function getNaviagtion() {
	fetch("http://popispop.net/wordpress/wp-json/wp/v2/categories?per_page.search=100")
		.then(res => res.json())
		.then(data => {
			console.log(data)
			data.forEach(addLink);
		})
}

function addLink(oneItem) {
	console.log(oneItem.name);

	if (oneItem.parent === 0 && oneItem.count === 8) {
		const link = document.createElement("a");
		link.textContent = oneItem.name;
		link.setAttribute("href", "category.html?category=" + oneItem.id)
		document.querySelector("nav").appendChild(link);
	}
}

function getSearchData() {
	const urlParams = new URLSearchParams(window.location.search);
	const search = urlParams.get("search");
	fetch("http://popispop.net/wordpress/wp-json/wp/v2/comedy?_embed&search=" + search)
		.then(res => res.json())
		.then(handleData)
}

function getCategoryData(catId) {
	console.log(catId);
	fetch("http://popispop.net/wordpress/wp-json/wp/v2/comedy?_embed&categories=" + catId)
		.then(res => res.json())
		.then(handleData);
}

function getFrontpageData() {
	fetch("http://popispop.net/wordpress/wp-json/wp/v2/comedy?_embed")
		.then(res => res.json())
		.then(handleData)
}

function getSingleBook() {
	const urlParams = new URLSearchParams(window.location.search);
	const id = urlParams.get("id");

	fetch("http://popispop.net/wordpress/wp-json/wp/v2/comedy/" + id + "?_embed")
		.then(res => res.json())
		.then(showSinglePost)
}

function showSinglePost(post1) {
	console.log(post1);
	document.querySelector("article h1").textContent = post1.title.rendered;

	document.querySelector(".director").innerHTML = post1.director;

	document.querySelector(".publisher1").innerHTML = post1.content.rendered;

	document.querySelector(".cast").textContent = post1.starring;

	document.querySelector(".released").textContent = post1.released;

	document.querySelector(".price").textContent = post1.price;


	const imgPath = post1._embedded["wp:featuredmedia"][0].media_details.sizes.medium_large.source_url;

	document.querySelector(".pic").src = imgPath;

}

function handleData(myData) {
	//1.loop
	myData.forEach(showPost);
}

function showPost(post) {
	console.log(post);

	const imgPath = post._embedded["wp:featuredmedia"][0].media_details.sizes.full.source_url;

	//2. Clone a template
	const template = document.querySelector(".myTemplate").content;
	const postCopy = template.cloneNode(true);

	//3. Using textContent & innerHTML for text and src for img

	postCopy.querySelector("h1").innerHTML = post.title.rendered

	//postCopy.querySelector(".publisher").innerHTML = post.director;

	//postCopy.querySelector(".body-copy").innerHTML = post.content.rendered;

	//postCopy.querySelector(".released").textContent = post.released;

	//postCopy.querySelector(".price").textContent = post.price;

	//postCopy.querySelector(".starring").textContent = post.starring;

	const img = postCopy.querySelector("img");
	img.setAttribute("src", imgPath);

	img.setAttribute("alt", "cover of the book" + post.title.rendered);

	const a = postCopy.querySelector("a");
	a.href = "subpage.html?id=" + post.id


	postCopy.querySelector("button").addEventListener("click", () => {
		showMore(post);
	});


	//4- append
	document.querySelector("#posts").appendChild(postCopy);

	function showMore(data) {
		console.log(data);

		modal.querySelector("h1").innerHTML = data.title.rendered
		modal.querySelector(".body-copy").innerHTML = data.content.rendered;

		modal.querySelector(".publisher").textContent = data.director;

		modal.querySelector(".pic").src = data._embedded["wp:featuredmedia"][0].media_details.sizes.full.source_url;

		modal.querySelector(".starring").innerHTML = data.starring;

		modal.querySelector(".price").textContent = data.price;

		modal.querySelector(".released").textContent = data.released;


		modal.classList.remove("hide");

	}

}
