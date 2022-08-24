const { writeFileSync, existsSync } = require("fs");

const microservices = require('./microservices.json');

const servicesByGroup = {};
const groups = microservices.groups.reduce((groups, group) => ({ [group.name]: group, ...groups }), {});

const formatName = str => str.toLowerCase()
    .replaceAll(" ", "_")
    .replaceAll("-", "_")
    .replaceAll("&", "")
    .replaceAll(",", "");

for (const service of microservices.apis) {
    servicesByGroup[service.group] = servicesByGroup[service.group] || [];
    servicesByGroup[service.group].push(service);
}

const getServiceLi = service => {
    const swaggerFile = __dirname + "/specs" + service.spec?.substring(service.spec.lastIndexOf("/"));
    const swaggerLink = existsSync(swaggerFile)
        ? ` - <a href="https://hmcts.github.io/reform-api-docs/swagger.html?url=${service.spec}">Swagger</a>`
        : '';

    return `<li><a href="${service.repository}">${service.name}</a>${swaggerLink}</li>`;
};

const getHTML = group => `
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="utf-8">
    <title>${group} Low Level Design (LLD)</title>
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.2.0/dist/css/bootstrap.min.css" rel="stylesheet" integrity="sha384-gH2yIJqKdNHPEq0n4Mqa/HGKIhSkIHeL5AyhkYV8i59U5AR6csBvApHHNl/vI1Bx" crossorigin="anonymous">
    <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.2.0/dist/js/bootstrap.bundle.min.js" integrity="sha384-A3rJD856KowSb7dwlZdYEkO39Gagi7vIsF0jrRAoQmDKKtQBHUuLZ9AsSv4jD4Xa" crossorigin="anonymous"></script>
    <link rel="stylesheet" href="./style.css">
  </head>
  <body>
    <div class="container px-4 pt-5 my-5">
      <h1 class="display-4 fw-bold">${group} Overview</h1>
      <div class="col-lg-6 mx-auto">
        <p class="lead my-4">${ groups[group].info ? groups[group].info : `Overview of the ${group} components and how they interact with other CFT components.` }</p>
      </div>
      <div class="overflow-hidden">
        <div class="container px-5">
          <img src="../c4/${formatName(group)}/images/structurizr-${formatName(group)}-overview.png" class="img-fluid border rounded-3 shadow-lg mb-4" alt="" loading="lazy">
        </div>
      </div>
    </div>
    <div class="container px-4 my-5">
      <h2 class="display-6 fw-bold">Services:</h2>
      <ul>${servicesByGroup[group].map(getServiceLi).join('')}</ul>
    </div>
    <div class="container">
      <footer class="d-flex flex-wrap justify-content-between align-items-center py-3 my-4 border-top">
        <ul class="nav">
          <li class="nav-item"><a href="https://hmcts.github.io/reform-api-docs/" class="nav-link px-2 text-muted">Home</a></li>
          <li class="nav-item"><a href="https://github.com/hmcts/reform-api-docs/" class="nav-link px-2 text-muted">About</a></li>
        </ul>
      </footer>
    </div>
  </body>
</html>
`;

for (const group in servicesByGroup) {
    writeFileSync(`${__dirname}/lld/${formatName(group)}.html`, getHTML(group));
}