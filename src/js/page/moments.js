import { documentFunction, butterfly } from "../utils/mainUtils";
import { HaloApi } from "../utils/haloApi";

class Moments {
  @documentFunction()
  registerMomentListPagination() {
    const paginationElement = document.getElementById("moment-list-pagination");
    if (!paginationElement) return;

    const listPaginationLinkElement = paginationElement.querySelector("a");
    if (!listPaginationLinkElement) return;

    listPaginationLinkElement.addEventListener("click", async (event) => {
      event.preventDefault();
      const momentContainerElement = document.querySelector(".moments-container .moments-inner");
      if (!momentContainerElement) return;

      const targetElement = event.target;
      const url = targetElement.href;
      targetElement.classList.add("loading");
      targetElement.textContent = "";

      try {
        const response = await fetch(url);
        const html = await response.text();
        const doc = new DOMParser().parseFromString(html, "text/html");
        const momentNewContainerElement = doc.querySelector(".moments-container .moments-inner");
        if (momentNewContainerElement) {
          this.registerMomentItem(momentNewContainerElement);
          momentNewContainerElement.querySelectorAll(".moments-item").forEach((element) => {
            momentContainerElement.appendChild(element);
            const commentScriptElement = element.querySelector(".comment-box .comment script:last-of-type");
            const code = commentScriptElement?.innerHTML || "";
            const parent = commentScriptElement.parentNode;
            parent.removeChild(commentScriptElement);
            const script = document.createElement("script");
            script.type = "text/javascript";
            script.appendChild(document.createTextNode(code));
            parent.appendChild(script);
          });
        }
        const nextPaginationElement = doc.querySelector("#moment-list-pagination a");
        if (nextPaginationElement) {
          targetElement.href = nextPaginationElement.href;
        } else {
          paginationElement.innerHTML = "";
        }
      } catch (error) {
        console.error(error);
      } finally {
        targetElement.classList.remove("loading");
        targetElement.textContent = butterfly.translate("page.moments.loadmore", "加载更多...");
        if (butterfly.$localize) {
          butterfly.$localize(".moments-inner");
        }
      }
    });
  }

  @documentFunction()
  registerMomentItem(containerElement) {
    const momentContainerElement = containerElement || document.querySelector(".moments-container .moments-inner");
    if (!momentContainerElement) return;

    const momentItemElements = momentContainerElement?.querySelectorAll(".moments-item");
    if (!momentItemElements || momentItemElements.length <= 0) return;

    momentItemElements.forEach((momentItemElement) => {
      this.registerMomentItemLike(momentItemElement);
      this.registerMomentItemComment(momentItemElement);
    });
  }

  registerMomentItemLike(itemElement) {
    const likedIds = JSON.parse(localStorage.getItem("momentlikedIds") || "[]");
    const likeButtonElement = itemElement.querySelector(".moment-tools .moment-like");
    if (!likeButtonElement) return;

    const momentName = itemElement.getAttribute("data-name") || "";
    if (likedIds && likedIds.includes(momentName)) {
      likeButtonElement.classList.add("on");
      return;
    }

    likeButtonElement.addEventListener("click", async () => {
      let upvoteCount = Number(likeButtonElement.getAttribute("data-links") || "0");
      try {
        await HaloApi.like("moment.halo.run", "moments", momentName);
        upvoteCount += 1;
        likedIds.push(momentName);
        likeButtonElement.classList.add("on");
        likeButtonElement.setAttribute("data-links", upvoteCount.toString());
        const likeTitleElement = likeButtonElement.querySelector(".moment-like-text");
        if (likeTitleElement) {
          likeTitleElement.textContent = upvoteCount.toString();
        }
        localStorage.setItem("momentlikedIds", JSON.stringify(likedIds));
      } catch (error) {
        console.error("点赞失败:", error);
      }
    }, { once: true });
  }

  registerMomentItemComment(itemElement) {
    const commentButtonElement = itemElement.querySelector(".moment-tools .comment-js");
    if (!commentButtonElement) return;

    commentButtonElement.addEventListener("click", () => {
      const commentBoxElement = itemElement.querySelector(".comment-box");
      if (commentBoxElement) {
        commentBoxElement.classList.toggle("is-show");
      }
    });
  }
}

!(() => {
  document.addEventListener("DOMContentLoaded", () => window.IndexClass = new Moments())
})();