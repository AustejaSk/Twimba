import { tweetsData } from './data.js'
import { v4 as uuidv4 } from 'https://jspm.dev/uuid';

document.addEventListener('click', function(e){
    if(e.target.dataset.like){
       handleLikeClick(e.target.dataset.like) 
    }
    else if(e.target.dataset.retweet){
        handleRetweetClick(e.target.dataset.retweet)
    }
    else if(e.target.dataset.reply){
        handleReplyClick(e.target.dataset.reply)
    }
    else if(e.target.id === 'tweet-btn'){
        handleTweetBtnClick()
    }
    else if(e.target.dataset.addReply){
        handleAddReplyClick(e.target.dataset.addReply)
    }
    else if(e.target.dataset.menu){
        hendleMenuClick(e.target.dataset.menu)
    }
    else if(e.target.dataset.tweetDelete){
        deleteTweetClick(e.target.dataset.tweetDelete)
    }
})
 
function hendleMenuClick(tweetId){
    const targetTweetObj = tweetsData.filter(function(tweet){
        return tweet.uuid === tweetId
    })[0]
    document.getElementById(`tweet-menu-${tweetId}`).classList.toggle('hidden')
}
 
function deleteTweetClick(tweetId) {
    const tweetIndex = tweetsData.findIndex(function(tweet) {
        return tweet.uuid === tweetId
    })
    
    tweetsData.splice(tweetIndex, 1)
    render()
}
 
function handleLikeClick(tweetId){ 
    const targetTweetObj = tweetsData.filter(function(tweet){
        return tweet.uuid === tweetId
    })[0]

    if (targetTweetObj.isLiked){
        targetTweetObj.likes--
    }
    else{
        targetTweetObj.likes++ 
    }
    targetTweetObj.isLiked = !targetTweetObj.isLiked
    render()
}

function handleRetweetClick(tweetId){
    const targetTweetObj = tweetsData.filter(function(tweet){
        return tweet.uuid === tweetId
    })[0]
    
    if(targetTweetObj.isRetweeted){
        targetTweetObj.retweets--
    }
    else{
        targetTweetObj.retweets++
    }
    targetTweetObj.isRetweeted = !targetTweetObj.isRetweeted
    render() 
}

function handleReplyClick(replyId){
    document.getElementById(`replies-${replyId}`).classList.toggle('hidden')
}

function handleAddReplyClick(addReplyId){
    const targetTweetObj = tweetsData.filter(function(tweet){
        return tweet.uuid === addReplyId
    })[0]
    
        const replyInput = document.getElementById(`reply-input-${addReplyId}`)
        
        if (replyInput.value){
            targetTweetObj.replies.unshift({
                handle: `@Scrimba`,
                profilePic: `images/scrimbalogo.png`,
                tweetText: replyInput.value
            })
        }
        render()
        replyInput.value = ''
        handleReplyClick(addReplyId)
}


function handleTweetBtnClick(){
    const tweetInput = document.getElementById('tweet-input')

    if(tweetInput.value){
        tweetsData.unshift({
            handle: `@Scrimba`,
            profilePic: `images/scrimbalogo.png`,
            likes: 0,
            retweets: 0,
            tweetText: tweetInput.value,
            replies: [],
            isLiked: false,
            isRetweeted: false,
            uuid: uuidv4()
        })
    render()
    tweetInput.value = ''
    }

}

function getFeedHtml(){
    let feedHtml = ``
    
    tweetsData.forEach(function(tweet){
        
        let likeIconClass = ''
        
        if (tweet.isLiked){
            likeIconClass = 'liked'
        }
        
        let retweetIconClass = ''
        
        if (tweet.isRetweeted){
            retweetIconClass = 'retweeted'
        }
        
        
        let repliesHtml = ''
        
        if(tweet.replies.length > 0){
            tweet.replies.forEach(function(reply){
                repliesHtml+=`
                    <div class="tweet-reply">
                        <div class="tweet-inner">
                            <img src="${reply.profilePic}" class="profile-pic">
                                <div>
                                    <p class="handle">${reply.handle}</p>
                                    <p class="tweet-text">${reply.tweetText}</p>
                                </div>
                            </div>
                    </div>
                    `
                })
                repliesHtml += `
                <div class="tweet-reply-input">
                    <img class="profile-pic profile-pic-reply" src="/images/scrimbalogo.png">
                    <input type="text" class="reply-input" id="reply-input-${tweet.uuid}" placeholder="Add a reply">
                    <i class="fa-solid fa-arrow-up" data-add-reply="${tweet.uuid}"></i>
                </div>`
            }
            else if (tweet.replies.length === 0){
                repliesHtml += `
                <div class="tweet-reply-input">
                    <img class="profile-pic profile-pic-reply" src="/images/scrimbalogo.png">
                    <input type="text" class="reply-input" id="reply-input-${tweet.uuid}" placeholder="Add a reply">
                    <i class="fa-solid fa-arrow-up" data-add-reply="${tweet.uuid}"></i>
                </div>`
            }
            
          
        feedHtml += `
            <div class="tweet">
                <div class="tweet-inner">
                    <img src="${tweet.profilePic}" class="profile-pic">
                    <div>
                        <span class="tweet-detail">
                            <i class="fa-solid fa-ellipsis-vertical" data-menu="${tweet.uuid}"></i>
                        </span> 
                        <p class="handle">${tweet.handle}</p>
                        <p class="tweet-text">${tweet.tweetText}</p>
                        <div class="tweet-details">
                            <span class="tweet-detail">
                                <i class="fa-regular fa-comment-dots"
                                data-reply="${tweet.uuid}"
                                ></i>
                                ${tweet.replies.length}
                            </span>
                            <span class="tweet-detail">
                                <i class="fa-solid fa-heart ${likeIconClass}"
                                data-like="${tweet.uuid}"
                                ></i>
                                ${tweet.likes}
                            </span>
                            <span class="tweet-detail">
                                <i class="fa-solid fa-retweet ${retweetIconClass}"
                                data-retweet="${tweet.uuid}"
                                ></i>
                                ${tweet.retweets}
                            </span>
                        </div>
                    </div>            
                </div>
                <div class="hidden" id="replies-${tweet.uuid}">
                    ${repliesHtml}
                </div>
                <div class="hidden tweet-menu" id="tweet-menu-${tweet.uuid}">
                    <button class="delete-tweet-btn" data-tweet-delete="${tweet.uuid}">Delete</button>
                </div>
            </div>
            `
   })
   return feedHtml 
}

function render(){
    document.getElementById('feed').innerHTML = getFeedHtml()
}

render()

