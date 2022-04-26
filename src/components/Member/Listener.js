// let oldE;
let sourceContainerId = '';
function cancelDefault(e) {
  e.preventDefault();
  e.stopPropagation();
  return false;
}
function dragStart(e) {
  // oldE = e;
	this.classList.add('dragging');
  e.dataTransfer.setData('text/plain', e.target.id);
  // tempid = e.target.id;
  sourceContainerId = this.parentElement.id;
  // console.log('sourceContainerId', sourceContainerId);
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
  let preChild;
  dropTargets.forEach((target) => {
    if (target.id === targetid) {
        // console.log('moveRight', target.id, targetid);
        moveMark = true;
    } else if (moveMark) {
      // console.log('moveRight', target.id, preChild.id);
      if (!target.firstElementChild) moveMark = false;
      e.dataTransfer.setData('text/plain', preChild.id);
      target.appendChild(preChild);
    }
    preChild = target.firstElementChild;
  });
}
function moveLeft(e) {
  console.log('moveLeft');
  const dropTargets = document.querySelectorAll('[data-role="drag-drop-container"]');
  let PrevID = null;
  dropTargets.forEach((target) => {
    if (!target.firstElementChild) PrevID = target.id;
    else if (PrevID) {
      e.dataTransfer.setData('text/plain', target.firstElementChild.id);
      document.querySelector(`#${PrevID}`).appendChild(target.firstElementChild);
      if (!target.firstElementChild) PrevID = target.id;
      else PrevID = null;
    }
  });
}
function dropped(e) {
  // execute function only when target container is different from source container
  if (this.id !== sourceContainerId) {
    // let moveold = false;
    // if (this.firstElementChild) {
    //  console.log('firstElementChild', this.id, e.target.id, oldE.target.id);
    //  moveold = true;
    // }
    cancelDefault(e);
    const id = e.dataTransfer.getData('text/plain');
		document.querySelector(`#${this.id}`).appendChild(document.querySelector(`#${id}`));
    e.dataTransfer.clearData();
    // e.target.appendChild(document.querySelector(`#${id}`));
    const targetid = parseInt(this.id.replace('container', ''), 10);
    const sourceid = parseInt(sourceContainerId.replace('container', ''), 10);
    // if (moveold) {
      if (targetid > sourceid) {
        moveLeft(e);
      } else {
        moveRight(e, this.id);
      }
      // e.dataTransfer.setData('text/plain', this.firstElementChild.id);
      // document.querySelector(`#${sourceContainerId}`).appendChild(this.firstElementChild);
    // }
  }
}
export {
	dragEnd, dragLeave, dragOver, dragStart, dropped, cancelDefault,
};
