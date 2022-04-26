let oldE;
let sourceContainerId = '';
function cancelDefault(e) {
  e.preventDefault();
  e.stopPropagation();
  return false;
}
function dragStart(e) {
  oldE = e;
	this.classList.add('dragging');
  e.dataTransfer.setData('text/plain', e.target.id);
  // tempid = e.target.id;
  sourceContainerId = this.parentElement.id;
  console.log('sourceContainerId', sourceContainerId);
}
function dragEnd() {
	this.classList.remove('dragging');
}
function dragOver(e) {
	cancelDefault(e);
	this.classList.add('hover');
}
function dragLeave() {
	this.classList.remove('hover');
}
function moveRight(e, targetid) {
  const dropTargets = document.querySelectorAll('[data-role="drag-drop-container"]');
  let moveMark = false;
  let isNext = false;
  let isLast = false;
  let preChild;
  dropTargets.forEach((target) => {
    if (target.id === targetid) {
      if (target.firstElementChild) {
        moveMark = true;
      }
    } else {
      if (moveMark) isNext = true;
      if (!target.firstElementChild) isLast = true;
    }
    if (moveMark && isNext) {
      e.dataTransfer.setData('text/plain', preChild.id);
      target.appendChild(preChild);
    }
    if (isLast) moveMark = false;
    preChild = target.firstElementChild;
  });
}
function moveLeft(e, sourceid, targetid) {
  const dropTargets = document.querySelectorAll('[data-role="drag-drop-container"]');
  let moveMark = false;
  let isPrev = false;
  let nextChild;
  let PrevID;
  dropTargets.forEach((target) => {
    nextChild = target.firstElementChild;
    if (target.id === sourceid) {
      isPrev = true;
    } else if (isPrev) {
      moveMark = true;
    }
    if (target.id === targetid) moveMark = false;
    if (isPrev && moveMark) {
      e.dataTransfer.setData('text/plain', nextChild.id);
      document.querySelector(`#${PrevID}`).appendChild(nextChild);
    }
    PrevID = target.id;
  });
}
function dropped(e) {
  // execute function only when target container is different from source container
  if (this.id !== sourceContainerId) {
    let moveold = false;
    if (this.firstElementChild) {
      console.log('firstElementChild', this.id, e.target.id, oldE.target.id);
      moveold = true;
    }
    cancelDefault(e);
    const id = e.dataTransfer.getData('text/plain');
		document.querySelector(`#${this.id}`).appendChild(document.querySelector(`#${id}`));
    // e.target.appendChild(document.querySelector(`#${id}`));
    if (moveold) {
      if (this.id > sourceContainerId) {
        moveLeft(e, sourceContainerId, this.id);
      } else {
        moveRight(e, this.id);
      }
      // e.dataTransfer.setData('text/plain', this.firstElementChild.id);
      // document.querySelector(`#${sourceContainerId}`).appendChild(this.firstElementChild);
    }
  }
}
export {
	dragEnd, dragLeave, dragOver, dragStart, dropped, cancelDefault,
};
