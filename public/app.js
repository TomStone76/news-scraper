$.getJSON("/articles", function(data) {
    for (let i = 0; i < data.length; i++) {
        $("#articles").append("<p data-id='" + data[i].id + "'>" + data[i].title + "<br />" + data[i].link) + "</p>");
    }
});