window.addEventListener('load', (event) => {
    //테마변경 (다크모드/일반모드)
    const mode = document.querySelector('.mode')
    const header = document.querySelector('header')
    const icons = mode.querySelectorAll('.fa-solid')

    const title = document.querySelector('.post-container .post-title input')
    const postContents = document.querySelector('.post-container .post-contents')
    const tagInput = document.querySelector('.post-container .post-tags input')

    mode.addEventListener('click', (event) => {
        document.body.classList.toggle('dark')
        header.classList.toggle('dark')

        title.classList.toggle('dark')
        postContents.classList.toggle('dark')
        tagInput.classList.toggle('dark')

        for(const icon of icons){
            icon.classList.contains('active') ?
            icon.classList.remove('active') :
            icon.classList.add('active')
        }
    })

    // 태그입력 기능
    const tagList = document.querySelector('.post-container .post-tags ul')
    const tagslimit = 10 // 태그 갯수 제한
    const tagLength = 10 // 태그 글자수 제한

    tagInput.addEventListener('keyup', function(event){
        console.log('태그 입력중...', event.key, tagInput.value)
        console.log(this)

        if(event.key === 'Enter' && this.value.length <= tagLength && tagList.children.length < tagslimit){
            const tag = document.createElement('li')
            tag.innerHTML = `#${this.value}<a href="#">X</a>`
            tagList.appendChild(tag)
            this.value = '' // 입력창 초기화
        }
    })
})