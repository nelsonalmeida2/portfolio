const projectsSection = document.querySelector('.projects .grid');

function carregarProjetos() {
    projetos.forEach(projeto => {
        const article = document.createElement('article');

        const title = document.createElement('h3');
        title.textContent = projeto.title;
        article.append(title);

        const image = document.createElement('img');
        image.src = projeto.image;
        article.append(image);

        const description = document.createElement('p');
        description.textContent = projeto.description;
        article.append(description);

        const button = document.createElement('button');
        button.textContent = "GitHub";
        button.addEventListener('click', () => {
            window.open(projeto.github, '_blank');
        });
        article.append(button);

        projectsSection.append(article);
    });
}

function carregarTecnologias() {
    const technologiesSection = document.querySelector('.technologies .grid');
    const technologyImages = ['CSharp.svg','C.svg','CSS3.svg','Django.svg','HTML5.svg','Java.svg','JavaScript.svg','Kotlin.svg','Microsoft-SQL-Server.svg','Python.svg','Selenium.svg','Tailwind-CSS.svg']; // Adicione os nomes dos arquivos aqui

    technologyImages.forEach(imgName => {
        const img = document.createElement('img');
        img.src = `img/technologies/${imgName}`;
        img.alt = imgName.split('.')[0];
        technologiesSection.append(img);
    });
}




document.addEventListener('DOMContentLoaded', () => {
    carregarProjetos();
    carregarTecnologias()
    });
