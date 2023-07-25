window.addEventListener('load', (event => {
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
}))