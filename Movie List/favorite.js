// 宣告變數
const BASE_URL = 'https://movie-list.alphacamp.io'
const INDEX_URL = BASE_URL + '/api/v1/movies/'
const POSTER_URL = BASE_URL + '/posters/'

//電影總清單，改為從localStorage拿到資料
const movies = JSON.parse(localStorage.getItem('favoriteMovies')) 
console.log (movies)



//將api抓取到的資料寫入dataPanel
const dataPanel = document.querySelector('#data-panel')
function renderMovieList(data) {
    let rawHTML = ''
    data.forEach((item) => {
      rawHTML += `
        <div class="col-sm-3">
            <div class="mb-2">
                <div class="card">
                    <img src="${POSTER_URL + item.image}" class="card-img-top" alt="Movie Poster">
                    <div class="card-body">
                        <h5 class="card-title">${item.title}</h5>
                    </div>
                    <div class="card-footer">
                        <button class="btn btn-primary btn-show-movie" data-toggle="modal" data-target="#movie-modal" data-id="${item.id}">More</button>
                        <button class="btn btn-danger btn-remove-favorite" data-id="${item.id}">X</button>
                    </div>
                </div>
            </div>
        </div>`
    })
    dataPanel.innerHTML = rawHTML
  }

  // 監聽 data panel, 加入"我的最愛+"的按鈕至監聽器中
dataPanel.addEventListener('click', function onPanelClicked(event){ 
    if (event.target.matches('.btn-show-movie')) {
      showMovieModal(Number(event.target.dataset.id))
    }else if (event.target.matches('.btn-remove-favorite'))
        removeFromFavorite(Number(event.target.dataset.id))
  })

  //將電影的細節資料寫入modal中
function showMovieModal(id) {
    const modalTitle = document.querySelector('#movie-modal-title')
    const modalImage = document.querySelector('#movie-modal-image')
    const modalDate = document.querySelector('#movie-modal-date')
    const modalDescription = document.querySelector('#movie-modal-description')
    axios.get(INDEX_URL + id).then((response) => {
      const data = response.data.results
      
      modalTitle.innerText = data.title
      modalDate.innerText = 'Release date: ' + data.release_date
      modalDescription.innerText = data.description
      modalImage.innerHTML = `<img src="${POSTER_URL + data.image}" alt="movie-poster" class="img-fluid">`
    })
}

//呼叫函式執行從localStorage抓取到的資料，渲染到頁面中
renderMovieList(movies)

// 將電影從我的最愛移除
function removeFromFavorite (id) {
    
    if (!movies) return //一旦收藏清單是空的，或傳入的 id 在收藏清單中不存在，就結束這個函式。

    //透過 id 找到要刪除電影的 index
    const movieIndex = movies.findIndex (movie => movie.id === id)
    if (movieIndex === -1 ) return

     //刪除該筆電影
    movies.splice(movieIndex,1)

    //存回 local storage
    localStorage.setItem('favoriteMovies', JSON.stringify(movies))
    //JSON.stringify()將資料轉為 JSON 格式的字串。

     //更新頁面
    renderMovieList(movies)

}





