const SALUD_INICIAL = 100;

new Vue({
    el: '#app',
    data: {
        saludJugador: SALUD_INICIAL,
        saludMonstruo: SALUD_INICIAL,
        hayUnaPartidaEnJuego: false,
        turnos: [], //es para registrar los eventos de la partida
        esJugador: false,
        rangoAtaque: [3, 10],
        rangoAtaqueEspecial: [10, 20],
        rangoAtaqueDelMonstruo: [5, 12],
    },

    methods: {
        getSalud(salud) {
            return `${salud}%`
        },
        empezarPartida: function () {
            this.hayUnaPartidaEnJuego = true;
            this.saludJugador = SALUD_INICIAL;
            this.saludMonstruo = SALUD_INICIAL;
            this.turnos = [];
        },
        atacar: function () {
            const damage = this.calcularHeridas(this.rangoAtaque);
            this.saludMonstruo -= damage;

            this.turnos.unshift({
                esJugador: true,
                text: 'El jugador golpea al monstruo por ' + damage
            });

            if (this.verificarGanador()) {
                return;
            }

            this.ataqueDelMonstruo();
        },
        ataqueEspecial: function () {
            const damage = this.calcularHeridas(this.rangoAtaqueEspecial);
            this.saludMonstruo -= damage;

            this.turnos.unshift({
                esJugador: true,
                text: 'El jugador golpea al monstruo por ' + damage
            });

            if (this.verificarGanador()) {
                return;
            }
            this.ataqueDelMonstruo();
        },

        curar: function () {
            this.saludJugador = this.saludJugador <= 90 ? this.saludJugador += 10 : SALUD_INICIAL;
            this.ataqueDelMonstruo();
        },

        registrarEvento(evento) {
        },

        terminarPartida: function () {
            this.hayUnaPartidaEnJuego = false;
        },

        ataqueDelMonstruo: function () {
            const damage = this.calcularHeridas(this.rangoAtaqueDelMonstruo);
            this.saludJugador -= damage;

            this.turnos.unshift({
                esJugador: false,
                text: 'El monstruo golpea al jugador por ' + damage
            });

            this.verificarGanador();
        },

        calcularHeridas: function (rango) {
            return Math.max(Math.floor(Math.random() * rango[1] + 1), rango[0]);
        },
        renewGame: function (message) {
            confirm(message) ? this.empezarPartida() : this.hayUnaPartidaEnJuego = false;
            return true;
        },
        verificarGanador: function () {
            if (this.saludMonstruo <= 0) {
                return this.renewGame("Ganaste! Jugar de nuevo?");
            } else if (this.saludJugador <= 0) {
                return this.renewGame("Perdiste! Jugar de nuevo?");
            }
            return false;
        },
        cssEvento(turno) {
            //Este return de un objeto es prque vue asi lo requiere, pero ponerlo acá queda mucho mas entendible en el codigo HTML.
            return {
                'player-turno': turno.esJugador,
                'monster-turno': !turno.esJugador
            }
        }
    }
});