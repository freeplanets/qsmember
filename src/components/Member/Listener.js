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
      e.dataTransfer.setData('text/plain', this.firstElementChild.id);
      document.querySelector(`#${sourceContainerId}`).appendChild(this.firstElementChild);
    }
  }
}
export {
	dragEnd, dragLeave, dragOver, dragStart, dropped, cancelDefault,
};
