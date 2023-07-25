const scroller = new Scroller(false) // 스크롤 객체 생성



window.addEventListener('load', (event) => {
    //테마변경 (다크모드/일반모드)
    const mode = document.querySelector('.mode')
    const header = document.querySelector('header')
    const icons = mode.querySelectorAll('.fa-solid')

    mode.addEventListener('click', (event) => {
        document.body.classList.toggle('dark')
        header.classList.toggle('dark')

        for(const icon of icons){
            icon.classList.contains('active') ?
            icon.classList.remove('active') :
            icon.classList.add('active')
        }
    })

    // 브라우저 상단으로 스크롤링 하기
    const arrowUp = document.querySelector('.footer .icons .scroll-up')
    arrowUp.addEventListener('click', (event) => {
        history.pushState({}, "", '#') // URL 주소 초기화
        scroller.setScrollPosition({top: 0, behavior: 'smooth'})
    })

    const logo = document.querySelector('header .logo')
    logo.addEventListener('click', (event) => {
        event.preventDefault() // a 태그의 기본적인 동작 제거
        history.pushState({}, "", '#') // URL 주소 초기화
        scroller.setScrollPosition({top: 0, behavior: 'smooth'})
    })

})