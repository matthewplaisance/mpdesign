const scrollEvent = (divId) => {
	console.log('divId :>> ', divId);
    const div = document.getElementById(divId);
	console.log('div :>> ', div);
    div.scrollIntoView({
        block: "start",
        inline: "center",
        behavior: "smooth",
        alignToTop: false
      })
};

document.getElementById('home-nav').addEventListener('click',() => {
	console.log("clicked home-vav");
	scrollEvent('home-sect');
});

document.getElementById('abt-nav').addEventListener('click',() => {
	console.log("object");
	scrollEvent('abt-sect');
});



document.getElementById('work-nav').addEventListener('click',() => {
	console.log("clicked work-vav");

	scrollEvent('work-sect');
});

document.getElementById('refs-nav').addEventListener('click',() => {
	console.log("regs");
	scrollEvent('refs-sect');
});

document.getElementById('contact-nav').addEventListener('click',() => {
	scrollEvent('contact-sect');
});

//goto project-detail
document.getElementById('project-kitchen1').addEventListener('click', () => {
	sessionStorage.projectDetail = 'project-kitchen1';
	let t = sessionStorage.projectDetail;
	console.log('t :>> ', t);
	window.location.href = './project-detail.html';

})