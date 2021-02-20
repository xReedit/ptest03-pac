import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class PlaySoundNotificationService {

  constructor() { }

  public playSound(id: number) {
    let nameSound = '';
    switch (id) {
      case 0: // notificacion pedido
        nameSound = 'notifica-pedido.mp3';
        break;
    }

    this.emitSound(nameSound);
  }

  private emitSound(name: string) {
    const audio = new Audio();
    audio.src = `../../../assets/audio/${name}`;
    audio.load();
    audio.play();
  }
}
