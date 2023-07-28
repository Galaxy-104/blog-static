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
})