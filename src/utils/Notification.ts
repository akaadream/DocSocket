export enum NotificationType {
    SUCCESS,
    ERROR,
    DEFAULT,
}

export class Notification {
    timeoutId: number;

    constructor(content: string, type: NotificationType) {
        this.timeoutId = -1;
        this.create(content, type);
    }

    /**
     * Create the notification DOM element and add it inside the page's DOM
     * @param content 
     * @param type 
     * @returns 
     */
    create(content: string, type: NotificationType) {
        const parent = document.getElementById('notifications');
        if (!parent) {
            return;
        } 

        const element = document.createElement('div');
        element.classList.add("notification");

        switch (type) {
            case NotificationType.SUCCESS:
                element.classList.add("is-success");
                break;
            case NotificationType.ERROR:
                element.classList.add("is-danger");
                break;
            case NotificationType.DEFAULT:
                element.classList.add("is-link");
                break;
        }

        const deleteButton = document.createElement('button');
        deleteButton.classList.add('delete');
        deleteButton.addEventListener('click', this.handleDelete);
        
        const contentElement = document.createTextNode(content);

        element.appendChild(deleteButton);
        element.appendChild(contentElement);

        parent.appendChild(element);

        this.timeoutId = setTimeout(() => {
            this.timeoutId = -1;
            this.delete(element);
        }, 4000);
    }

    /**
     * When the user click on the delete button
     * /!\ (This is not a function from the class because it's an event)
     * @param event 
     */
    handleDelete(event: Event) {
        event.preventDefault();

        if (event.target instanceof HTMLElement) {
            const parent = (event.target as HTMLElement).parentElement
            if (parent) {
                parent.parentNode?.removeChild(parent);
            }
        }
    }

    /**
     * Delete the notification
     * @param element 
     */
    delete(element: HTMLElement) {
        if (this.timeoutId !== -1) {
            clearTimeout(this.timeoutId);
        }
        element.parentNode?.removeChild(element);
    }
}