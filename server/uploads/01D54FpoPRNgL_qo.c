#include <stdio.h>
#include <stdlib.h>

struct node {
    int coef;
    int exp;
    struct node *next; 
};

struct node* createpoly() {
    struct node *newnode, *head = NULL, *temp;
    int a = 1;
    
    while(a) {
        newnode = (struct node*)malloc(sizeof(struct node));
        printf("Enter coefficient and exponent: ");
        scanf("%d%d", &newnode->coef, &newnode->exp);
        newnode->next = NULL;
        
        if (head == NULL) {
            head = newnode;
        } else {
            temp = head;
            while (temp->next != NULL) {
                temp = temp->next;
            }
            temp->next = newnode;
        }
        
        printf("To exit, press 0, else press 1: ");
        scanf("%d", &a);
    }
    
    return head;
}

struct node* polyadd(struct node* p1, struct node* p2) {
    struct node* result = NULL;
    struct node* temp;
    
    while (p1 != NULL && p2 != NULL) {
        if (p1->exp > p2->exp) {
            temp = (struct node*)malloc(sizeof(struct node));
            temp->coef = p1->coef;  
            temp->exp = p1->exp;
            temp->next = result;
            result = temp;
            p1 = p1->next;
        } else if (p1->exp < p2->exp) {
            temp = (struct node*)malloc(sizeof(struct node));
            temp->coef = p2->coef;
            temp->exp = p2->exp;
            temp->next = result;
            result = temp;
            p2 = p2->next;
        } else {
            temp = (struct node*)malloc(sizeof(struct node));
            temp->coef = p1->coef + p2->coef;
            temp->exp = p1->exp;
            temp->next = result;
            result = temp;
            p1 = p1->next;
            p2 = p2->next;
        }
    }

    while (p1 != NULL) {
        temp = (struct node*)malloc(sizeof(struct node));
        temp->coef = p1->coef;
        temp->exp = p1->exp;
        temp->next = result;
        result = temp;
        p1 = p1->next;
    }
    
    while (p2 != NULL) {
        temp = (struct node*)malloc(sizeof(struct node));
        temp->coef = p2->coef;
        temp->exp = p2->exp;
        temp->next = result;
        result = temp;
        p2 = p2->next;
    }

    return result;
}

void display(struct node* temp) {
    if (temp == NULL) {
        printf("Empty Polynomial\n");
        return;
    }

    while (temp != NULL) {
        printf("%d x^%d", temp->coef, temp->exp);
        temp = temp->next;
        if (temp != NULL) {
            printf(" + ");
        }
    }
    printf("\n");
}

int main() {
    struct node* p1 = NULL;
    struct node* p2 = NULL;
    struct node* result = NULL;

    printf("Enter first polynomial:\n");
    p1 = createpoly();
    printf("First polynomial: ");
    display(p1);
    
    printf("Enter second polynomial:\n");
    p2 = createpoly();
    printf("Second polynomial: ");
    display(p2);
    
    printf("Sum of polynomials: ");
    result = polyadd(p1, p2);
    display(result);

    return 0;
}
