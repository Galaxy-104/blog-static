window.addEventListener('load', (event) => {
    //테마변경 (다크모드/일반모드)
    const mode = document.querySelector('.mode')
    const header = document.querySelector('header')
    const icons = mode.querySelectorAll('.fa-solid')

    const title = document.querySelector('.post-container .post-title input')
    const postContents = document.querySelector('.post-container .post-contents')
    const tagInput = document.querySelector('.post-container .post-tags input')
    const postCategory = document.querySelector('.post-container .post-category select')

    mode.addEventListener('click', (event) => {
        document.body.classList.toggle('dark')
        header.classList.toggle('dark')

        title.classList.toggle('dark')
        postContents.classList.toggle('dark')
        tagInput.classList.toggle('dark')
        postCategory.classList.toggle('dark')


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

        const trimTag = this.value.trim() // 글자 양쪽에 공백을 제거

        if(event.key === 'Enter' && trimTag !== '' && trimTag.length <= tagLength && tagList.children.length < tagslimit){
            const tag = document.createElement('li')
            tag.innerHTML = `#${trimTag}<a href="#">X</a>`
            tagList.appendChild(tag)
            this.value = '' // 입력창 초기화
        }
    })

    // 태그 삭제 기능(이벤트 위임 사용)
    tagList.addEventListener('click', function(event){
        console.log(event.target, event.target.parentElement, event.target.hasAttribute('href'))

        event.preventDefault()
        if(event.target.hasAttribute('href')){
            tagList.removeChild(event.target.parentElement)
        }

    })

    // 파일 입력 처리
    postContents.focus() // 첫로딩 때 커서 보이게 하기 
    postContents.insertAdjacentElement('afterbegin', createNewLine()) // 첫줄에 새 공백라인 생성

    let lastCaretLine = postContents.firstChild // Caret: 커서 (커서 위치의 엘리먼트 저장)
    const uploadInput = document.querySelector('.upload input')
    uploadInput.addEventListener('change', function(event){
        const files = this.files
        console.log(files)

        if(files.length > 0){
            for(const file of files){
                const fileType = file.type

                if(fileType.includes('image')){
                    console.log('image')
                    const img = buildMediaElement('img', {src: URL.createObjectURL(file)})
                    lastCaretLine = addFileToCurrentLine(lastCaretLine, img)
                }else if(fileType.includes('video')){
                    console.log('video')
                    const video = buildMediaElement('video', 
                        { className: 'video-file', controls: true,
                        src: URL.createObjectURL(file) }
                    )
                    lastCaretLine = addFileToCurrentLine(lastCaretLine, video)
                }else if(fileType.includes('audio')){
                    console.log('audio')
                    const audio = buildMediaElement('audio', 
                        { className: 'audio-file', controls: true,
                        src: URL.createObjectURL(file)}
                    )
                    lastCaretLine = addFileToCurrentLine(lastCaretLine, audio)

                }else{
                    console.log('file')
                    const div = document.createElement('div')
                    div.className = 'normal-file'
                    div.contentEditable = false
                    div.innerHTML = `
                        <div class="file-icon">
                            <span class= "meterial-icons">folder</span>
                        </div>
                        <div class="file-info">
                            <h3>${getFileName(file.name, 70)}</h3>
                            <p>${getFileSize(file.size)}</p>
                        </div>`

                    lastCaretLine = addFileToCurrentLine(lastCaretLine, div)
                }
            }

            // 커서 위치를 맨 마지막으로 추가한 파일 아래쪽에 보여주기
            // 사용자가 드래그로 선택한 범위
            const selection = document.getSelection()
            selection.removeAllRanges()

            // 해당 엘리먼트를 범위로 지정
            const range = document.createRange()
            range.selectNodeContents(lastCaretLine)
            range.collapse() // 범위가 아니라 커서 지정
            selection.addRange(range) // 새로운 범위가 설정

            postContents.focus() // 편집기에 커서 보여주기

        }
    })

    postContents.addEventListener('blur', function(event){
        // 편집기가 blur될 때 마지막 커서 위치에 있는 엘리먼트
        lastCaretLine = document.getSelection().anchorNode
        console.log(lastCaretLine.parentNode, lastCaretLine, lastCaretLine.length)
    })

    // 텍스트 포맷
    const textTool = document.querySelector('.text-tool')
    const colorBoxes = textTool.querySelectorAll('.text-tool .color-box')
    const fontBox = textTool.querySelector('.text-tool .font-box')
    textTool.addEventListener('click', function(event){
        event.stopPropagation() // document 클릭 이벤트와 충돌하지 않도록 설정
        console.log(event.target)
        switch(event.target.innerText){
            case 'format_bold':
                changeTextFormat('bold')
                break
            case 'format_italic':
                changeTextFormat('italic')
                break
            case 'format_underlined':
                changeTextFormat('underline')
                break
            case 'format_strikethrough':
                changeTextFormat('strikeThrough')
                break 
            case 'format_color_text':
                hideDropdown(textTool, 'format_color_text')
                colorBoxes[0].classList.toggle('show')
                break 
            case 'format_color_fill':
                hideDropdown(textTool, 'format_color_fill')
                colorBoxes[1].classList.toggle('show')
                break 
            case 'format_size':
                hideDropdown(textTool, 'format_size')
                fontBox.classList.toggle('show')
                break 

        }
        // 커서 설정
        postContents.focus({preventScroll: true})
    })

    colorBoxes[0].addEventListener('click', (event) => changeColor(event, 'foreground'))
    colorBoxes[1].addEventListener('click', (event) => changeColor(event, 'background'))
    fontBox.addEventListener('click', changeFontSize)
    
    // 텍스트 정렬
    const alignTool = document.querySelector('.align-tool')
    alignTool.addEventListener('click', function(event){
        console.log(event.target.innerText)
        switch(event.target.innerText){
            case 'format_align_left':
                changeTextFormat('justifyLeft')
                break
            case 'format_align_center':
                changeTextFormat('justifyCenter')
                break 
            case 'format_align_right':
                changeTextFormat('justifyRight')
                break
            case 'format_align_justify':
                changeTextFormat('justifyFull')
                break
        }
    })

})

// 공백 엘리먼트 생성
function createNewLine(){
    const newline = document.createElement('div')
    newline.innerHTML = `<br>`
    return newline
}

function addFileToCurrentLine(line, file){
    console.log(line.nodeType) // nodeType = 3 - 텍스트 노드
    if(line.nodeType === 3){
        line = line.parentNode
        console.log(line)
    }
    line.insertAdjacentElement('afterend', createNewLine())
    line.nextSibling.insertAdjacentElement('afterbegin', file)
    line.nextSibling.insertAdjacentElement('afterend', createNewLine())
    return line.nextSibling.nextSibling // 파일 하단에 위치한 공백라인
}

function getFileName(name, limit){
    return name.length > limit ?
    `${name.slice(0, limit)}...${name.slice(name.lastIndexOf('.'), name.length)}`
    : name
}

// number : 파일 용량(bytes 단위)
function getFileSize(number){
    if(number < 1024){
        return number + 'bytes'
    }else if(number >= 1024 && number < 1048576){
        return (number/1024).toFixed(1) + 'KB'
    }else if(number >= 1048576){
        return(number/1048576).toFixed(1) + 'MB'
    }
}

// options : { className: 'audio', controls: 'true'}
function buildMediaElement(tag, options){
    const mediaElement = document.createElement(tag)
    for(const option in options){ // 생성한 엘리먼트의 속성 설정
        mediaElement[option] = options[option]
    }
    return mediaElement
}

function changeTextFormat(style, param){
    console.log(style)
    document.execCommand(style, false, param)
}

function hideDropdown(toolbox, currentDropdown){
    // 현재 text-tool 안에서 열려있는 드롭다운 메뉴를 조회
    const dropdown = toolbox.querySelector('.select-menu-dropdown.show')
    if(dropdown){
        console.log(currentDropdown) // 현재 클릭한 아이콘
        console.log(dropdown.parentElement)
    }
    if(dropdown && dropdown.parentElement.querySelector('a span').innerText !== currentDropdown){
        dropdown.classList.remove('show')
    }
    
}

document.addEventListener('click', function(e){
    // 현재 열려있는 드롭다운 메뉴 조회
    const dropdown = document.querySelector('.select-menu-dropdown.show')
    if(dropdown && !dropdown.contains(e.target)){
        dropdown.classList.remove('show')
    } 

})

function changeColor(event, mode){
    event.stopPropagation() // 클릭이벤트 버블링 방지
    if(!event.target.classList.contains('select-menu-dropdown')){
        console.log(mode, event.target)
        switch(mode){
            case 'foreground':
                changeTextFormat('foreColor', event.target.style.backgroundColor) // 글자색 변경
                break
            case 'background':
                changeTextFormat('backColor', event.target.style.backgroundColor) // 배경색 변경
                break
        }
        // 색상 선택시 드롭다운 메뉴 숨기기
        event.target.parentElement.classList.remove('show')
    }
}

function changeFontSize(event){
    event.stopPropagation()
    if(!event.target.classList.contains('select-menu-dropdown')){
        changeTextFormat('fontSize', event.target.id)
        event.target.parentElement.classList.remove('show')
    }
}