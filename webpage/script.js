function postBlog(title, content, author, date) {
    let data = {
        title : title,
        content : content,
        author : author,
        publishDate : date 
    }

    let settings = {
        method: "post",
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    }

    fetch("/blog-posts", settings)
        .then(res => {
            if(res.ok) {
                return res.json();
            } 
            throw new Error(res.statusText);
        })
        .then(resJSON => {
            console.log(resJSON);
            $("#postTitle").val("");
            $("#postContent").val("");
            $("#postAuthor").val("");
            $("#postDate").val("");
            $(".postError").css("visibility", "hidden");
        })
        .catch(err => {
            $(".postError").text(err);
            $(".postError").css("visibility", "visible");
            console.log(err);
        });

    displayBlogs();
}

function putBlog(id, title, content, author, date) {
    let body = {
        id: id,
        title: title != "" ? title : undefined,
        content: content != " " ? content : undefined,
        author: author != "" ? author : undefined,
        publishDate: date != "" ? date : undefined
    }

    let settings = {
        method: "put",
        headers: {
            'Content-Type' : 'application/json'
        },
        body: JSON.stringify(body)
    }

    let url = "/blog-posts/" + id;

    fetch(url, settings)
        .then(res => {
            if(res.ok) {
                return res.json();
            }
            throw new Error(res.statusText);
        })
        .then(resJSON => {
            console.log(resJSON);
            $("#putId").val("");
            $("#putTitle").val("");
            $("#putContent").val("");
            $("#putAuthor").val("");
            $("#putDate").val("");
            $(".putError").css("visibility", "hidden");
        })
        .catch(err => {
            $(".putError").text(err);
            $(".putError").css("visibility", "visible");
            console.log(err);
        })

    displayBlogs();
}

function deleteBlog(id) {
    let settings = {
        method : "delete"
    }
    
    let url = "/blog-posts/" + id;

    fetch(url, settings)
        .then(res => {
            if(res.ok){
                return res.json();
            }
            throw new Error(res.statusText);
        })
        .then(resJSON => {
            console.log(resJSON);
            $("#deleteId").val("");
            $(".deleteError").css("visibility", "hidden");
        })
        .catch(err => {
            $(".deleteError").text(err);
            $(".deleteError").css("visibility", "visible");
            console.log(err);
        })

    displayBlogs();
}

$("#postForm").on("submit", function(e) {
    e.preventDefault();

    let postTitle = $("#postTitle").val();
    let postContent = $("#postContent").val();
    let postAuthor = $("#postAuthor").val();
    let postDate = $("#postDate").val();
    postBlog(postTitle, postContent, postAuthor, postDate);
});

$("#putForm").on("submit", function(e) {
    e.preventDefault();

    let updId = $("#putId").val();
    let updTitle = $("#putTitle").val();
    let updContent = $("#putContent").val();
    let updAuthor = $("#putAuthor").val();
    let updDate = $("#putDate").val();

    putBlog(updId, updTitle, updContent, updAuthor, updDate);
});

$("#deleteForm").on("submit", function(e) {
    e.preventDefault();

    let deleteId = $("#deleteId").val();

    deleteBlog(deleteId);
});

function init() {
    displayBlogs();
}

function displayBlogs() {
    $("#blogPosts").html("");
    fetch("/blog-posts")
        .then(res => {
            if(res.ok) {
                return res.json();
            } 
            throw new Error(res.statusText);
        })
        .then(resJSON => {
            for(let i = 0; i < resJSON.length; i++) {
                $("#blogPosts").append(`<li>
                                            <h2> ${resJSON[i].title} </h2>
                                            <p> ${resJSON[i].content} </p>
                                            <p> Author: ${resJSON[i].author} </p>
                                            <p> Published date: ${resJSON[i].publishDate} </p>
                                            <p> ID: ${resJSON[i].id} </p>
                                        </li> <hr>`);
            }
        })
        .catch(err => {
            console.log(err);
        });
}

init();