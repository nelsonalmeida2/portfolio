const projectsSection = document.querySelector('#projects .grid');

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

document.addEventListener('DOMContentLoaded', () => {
    carregarProjetos();
});
