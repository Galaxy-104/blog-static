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

    // 내비게이션 메뉴 클릭시 해당 섹션으로 곧바로 스크롤하기
    const sections = document.querySelectorAll('section:not(.footer)')
    const nav = document.querySelector('.navbar ul')
    
    // 내비게이션 메뉴 클릭한 경우
    nav.querySelectorAll('li a').forEach(anchor => {
        anchor.addEventListener('click', function(event){
            const section = this.getAttribute('href')
            console.log(document.querySelector(section))
            const offsetToElementFromViewport =
            document.querySelector(section).getBoundingClientRect().top

            if(!scroller.getScrollState()){
                event.preventDefault()
                history.pushState({}, "", `${section}`)

                const offsetToElementFromDocument = offsetToElementFromViewport +
                scroller.getScrollPosition() // 문서 상단에서 섹션까지의 거리
                scroller.setScrollPosition({
                    top: offsetToElementFromDocument - header.offsetHeight - 10, behavior: 'smooth'
                })
            }
        })
    })

    let lastScrollLocation = 0 // 최근 스크롤 위치
    let sectionToMove, menulink

    // 스크롤링 중에 발생하는 이벤트
    window.addEventListener('scroll', (event) => {
        // 스크롤이 끝났는지 아닌지 체크하기
        scroller.isScrollended()
        
        // 스크롤링 중에 어느정도 스크롤 바를 내리면 헤더에 그림자 적용
        scroller.getScrollPosition() > header.offsetHeight ?
        header.classList.add('active')
        : header.classList.remove('active')

        // 스크롤링 중에 텍스트 애니메이션 적용하기
        sections.forEach(section => {
            const title = section.querySelector('.content h3')
            const paragraph = section.querySelector('.content p')

            if(section.getBoundingClientRect().top < header.offsetHeight + 50){
                // 해당 섹션이 헤더에 가까워지면 텍스트 애니메이션 적용하기
                title.classList.add('show')
                paragraph.classList.add('show')

                // 해당 섹션이 헤더에 가까워지면 해당 메뉴에 하이라이트 적용
                nav.querySelector('a.active').classList.remove('active')
                nav.querySelector(`a[href="#${section.id}"]`).classList.add('active')

            }

            // 스크롤바가 브라우저 상단에 도달하면 텍스트 애니메이션 해제
            if(scroller.getScrollPosition() < 10){
                title.classList.remove('show')
                paragraph.classList.remove('show')
            }
        })
    })
    
    
})