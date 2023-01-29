let page = 1
const perPage = 10

function loadMovieData(title=null){

    if(title!=null){
        fetchLink = `/api/movies?page=${page}&perPage=${perPage}&title=${title}`
    }else{
        fetchLink = `/api/movies?page=${page}&perPage=${perPage}`
    }

    fetch(fetchLink)
    .then(response=>response.json())
    .then(result=>{

        //Show pagination
        pagination = document.querySelector("ul.pagination.d-none")
        if(pagination){pagination.classList.remove("d-none")}

        //Display Data
        result_html = result.map(record=>{
            if(record.plot===undefined){record.plot="N/A"}
            if(record.rated===undefined){record.rated="N/A"}
           
            return `<tr data-id="${record._id}">
            <td>${record.year}</td>
            <td>${record.title}</td>
            <td>${record.plot}</td>
            <td>${record.rated}</td>
            <td>${Math.floor(record.runtime / 60)} : ${(record.runtime % 60).toString().padStart(2, '0')}</td>
            </tr>`
        })
        document.querySelector("tbody").innerHTML = result_html.join("")

        //Update current page
        document.querySelector("#current-page").textContent=page

        //Add click function to rows
        const new_records = document.querySelectorAll("tbody tr")
        new_records.forEach(nr=>{

            nr.addEventListener('click',e=>{
               
            const record_id = nr.getAttribute("data-id")
         

                fetch(`/api/movies/${record_id}`)
                .then(response=>response.json())
                .then(result=>{
                
                if(result.cast===undefined || result.cast==""){result.cast="N/A"}
                else{result.cast = result.cast.join(",")}

                if(result.poster!==undefined && result.poster!=""){result.poster=`<img class="img-fluid w-100" src="${result.poster}"><br><br>`}
                else{result.poster=""}

                document.querySelector("#detailsModal h5.modal-title").textContent=result.title
                document.querySelector("#detailsModal div.modal-body").innerHTML=`
                ${result.poster}
                <strong>Directed By:</strong> ${result.directors.join(",")}<br><br>
                <p>${result.fullplot===undefined?"":result.fullplot}</p>
                <strong>Cast:</strong> ${result.cast}<br><br>
                <strong>Awards:</strong> ${result.awards.text}<br>
                <strong>IMDB Rating:</strong> ${result.imdb.rating} (${result.imdb.votes} votes)`

                let myModal = new bootstrap.Modal(document.getElementById('detailsModal'), {
                    backdrop: 'static', // default true - "static" indicates that clicking on the backdrop will not close the modal window
                    keyboard: false, // default true - false indicates that pressing on the "esc" key will not close the modal window
                    focus: true, // default true - this instructs the browser to place the modal window in focus when initialized
                  });
                  
                  myModal.show();

                }) //End of fetch
            }) //End of click
        }) //End of foreach

    }) //End of main fetch
}


addEventListener('DOMContentLoaded', (e) => {
    document.getElementById("previous-page").addEventListener('click',e=>{
        if(page>1){page--;loadMovieData();}
    })

    document.getElementById("next-page").addEventListener('click',e=>{
        page++;
        loadMovieData();
    })

    document.getElementById("searchForm").addEventListener('submit',e=>{
        e.preventDefault();
        
        loadMovieData(document.getElementById("title").value);
    })

    document.getElementById("clearForm").addEventListener('click',e=>{
        e.preventDefault();
        document.getElementById("title").value="";
        loadMovieData();
    })
});