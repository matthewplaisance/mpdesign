
const displayProject = () => {
    const project = sessionStorage.projectDetail;
    console.log('project :>> ', project);
    if (project == undefined){
        return
    }
    let carouselImg1;
    let carouselImg2;
    let img1;
    let img2;

    if (project == 'project-kitchen1'){
        carouselImg1 = 'assets/img/job-kitchen/IMG_8534.JPG';
        carouselImg2 = 'assets/img/job-kitchen/IMG_9441.JPG';
        img1 = 'assets/img/job-kitchen/IMG_8529.JPG';
        img2 = 'assets/img/job-kitchen/IMG_9443.JPG';
    }
    let tst = document.getElementById('carousel-img1');
    console.log('tst :>> ', tst);
    document.getElementById('carousel-img1').style.backgroundImage = `url('${carouselImg1}')`
    document.getElementById('carousel-img2').style.backgroundImage = `url('${carouselImg2}')`

    document.getElementById('img1').src = img1;
    document.getElementById('img2').src = img2;
}

displayProject();

