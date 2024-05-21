export class ModalManager {
    constructor() {
        this.handleOpeningButtonEvent();
        this.handleKeyboard();
        this.handleCloseModalEvent();
    }

    private handleKeyboard() {
        document.addEventListener('keydown', (event: KeyboardEvent) => {
            if (event.key === "Escape") {
                this.closeAllModals();
            }
        })
    }

    private handleOpeningButtonEvent() {
        (document.querySelectorAll('.modal-opening-button') || []).forEach((element: Element) => {
            const buttonElement = element as HTMLElement;
            if (buttonElement) {
                const modal = buttonElement.dataset.target;
                if (modal) {
                    const target = document.getElementById(modal);
                    if (target) {
                        buttonElement.addEventListener('click', (event: Event) => {
                            event.preventDefault();

                            this.openModal(target);
                        });
                    }
                }
            }
        });
    }

    private handleCloseModalEvent() {
        (document.querySelectorAll('.modal-background, .modal-close, .modal-card .delete, .modal-card-foot .button') || []).forEach((element: Element) => {
            const modalElement = element as HTMLElement;
            if (modalElement) {
                const target = modalElement.closest('.modal') as HTMLElement;
                if (target) {
                    modalElement.addEventListener('click', (event: Event) => {
                        event.preventDefault();
                        this.closeModal(target);
                    });
                }
            }
        });
    }

    openModal(element: HTMLElement) {
        element.classList.add('is-active');
    }

    closeModal(element: HTMLElement) {
        element.classList.remove('is-active');
    }

    closeAllModals() {
        (document.querySelectorAll('.modal') || []).forEach((modal: Element) => {
            if (modal instanceof HTMLElement) {
                const modalElement = modal as HTMLElement;
                if (modalElement) {
                    this.closeModal(modalElement);
                }
            }
        })
    }
}