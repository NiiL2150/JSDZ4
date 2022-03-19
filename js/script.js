$("#load").hide();
const genLink = "http://www.omdbapi.com/?apikey=";
const apikey = "youromdbapihere";
const originalPopUp = modalInfo.innerHTML;
function getGeneralLink(){
  return `${genLink}${apikey}`
}
function getSearchLink(keyword = ""){
  return `${getGeneralLink()}&s=${keyword}`
}
function getIdLink(id = ""){
  return `${getGeneralLink()}&i=${id}`
}

$("#sendQuery").click((e)=>{
  e.preventDefault();
  loadData(movieTitle.value);
});

let loadData = (string = "")=>{
  ajaxHandler(getSearchLink(string), getData);
}

let ajaxHandler = (link = "", next = null)=>{
    $.ajax({
    url: link,
    dataType: "json",
    type: "GET",
    beforeSend:()=>{$("#load").show()}
  }).done(next).fail(()=>{
    $("#load").hide();
    ajaxFailHandler();
  });
}

let toggleModal = ()=>{
  darkener.classList.toggle("hidden");
  coolModal.classList.toggle("hidden");
  setTimeout(()=>{coolModal.classList.toggle("load")}, 2); //только так да работает
}

let popUpAlert = (str = "")=>{
  modalResponse.textContent = str;
  toggleModal();
}

let loadDetails = (id = "")=>{
  ajaxHandler(getIdLink(id), getDetails);
}

let ajaxFailHandler = (str = "An error occured")=>{
  modalInfo.innerHTML = "";
  popUpAlert(str);
}

let getDetails = (data)=>{
  $("#load").hide();
  if(data.Response != "True"){
    ajaxFailHandler();
  }
  modalInfo.innerHTML = originalPopUp;
  ftitle.textContent = data.Title;
  frelease.textContent = data.Released;
  fgenre.textContent = data.Genre;
  fcountry.textContent = data.Country;
  fdirector.textContent = data.Director;
  fwriter.textContent = data.Writer;
  factors.textContent = data.Actors;
  fawards.textContent = data.Awards;
  detailedImage.src = data.Poster;
  popUpAlert("Film info:");
}

let getData = (data)=>{
  $("#load").hide();
  if(data.Response != "True"){
    ajaxFailHandler();
  }
  if(data.totalResults===0){
    ajaxFailHandler("No results");
  }
  $.each(data.Search, (index, item)=>{
    let cont = document.createElement("div");
    cont.classList.toggle("col");
    let x = document.createElement("div");
    x.classList.toggle("cont");
    let y = document.createElement("img");
    y.src = item.Poster;
    x.appendChild(y);
    let z = document.createElement("div");
    z.classList.toggle("info");
    let type = document.createElement("p");
    type.textContent = item.Type;
    z.appendChild(type);
    let title = document.createElement("p");
    title.textContent = item.Title;
    z.appendChild(title);
    let year = document.createElement("p");
    year.textContent = item.Year;
    z.appendChild(year);
    let details = document.createElement("button");
    details.textContent = "Details";
    details.onclick = ()=>{loadDetails(item.imdbID);}
    z.appendChild(details);
    x.appendChild(z);
    cont.appendChild(x);
    movieList.appendChild(cont);
  });
};