import { animate, state, style, transition, trigger } from '@angular/animations';

export let fade =
    trigger('fade',[
      state('void',style({opacity:0})),
      transition(':enter, :leave',
       animate(1000)),
    ]);

export let slideIn =
    trigger('inOut',[
        state('out', style({ transform: 'translateX(-50px)'})),
        state('in', style({ transform: 'translateX(0px)'})),
        transition('out <=> in', animate(300))
    ]);

export let deleteSlideOut =
    trigger('deleteSlide',[
        state('in',style({transform: 'translateX(0px)'})),
        state('out',style({transform: 'translateX(-1500px)'})),
        transition('in <=> out', animate(300))
    ])