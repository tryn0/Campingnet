'use strict';


customElements.define('compodoc-menu', class extends HTMLElement {
    constructor() {
        super();
        this.isNormalMode = this.getAttribute('mode') === 'normal';
    }

    connectedCallback() {
        this.render(this.isNormalMode);
    }

    render(isNormalMode) {
        let tp = lithtml.html(`
        <nav>
            <ul class="list">
                <li class="title">
                    <a href="index.html" data-type="index-link">campingnet documentation</a>
                </li>

                <li class="divider"></li>
                ${ isNormalMode ? `<div id="book-search-input" role="search"><input type="text" placeholder="Type to search"></div>` : '' }
                <li class="chapter">
                    <a data-type="chapter-link" href="index.html"><span class="icon ion-ios-home"></span>Getting started</a>
                    <ul class="links">
                        <li class="link">
                            <a href="overview.html" data-type="chapter-link">
                                <span class="icon ion-ios-keypad"></span>Overview
                            </a>
                        </li>
                        <li class="link">
                            <a href="index.html" data-type="chapter-link">
                                <span class="icon ion-ios-paper"></span>README
                            </a>
                        </li>
                                <li class="link">
                                    <a href="dependencies.html" data-type="chapter-link">
                                        <span class="icon ion-ios-list"></span>Dependencies
                                    </a>
                                </li>
                    </ul>
                </li>
                    <li class="chapter modules">
                        <a data-type="chapter-link" href="modules.html">
                            <div class="menu-toggler linked" data-toggle="collapse" ${ isNormalMode ?
                                'data-target="#modules-links"' : 'data-target="#xs-modules-links"' }>
                                <span class="icon ion-ios-archive"></span>
                                <span class="link-name">Modules</span>
                                <span class="icon ion-ios-arrow-down"></span>
                            </div>
                        </a>
                        <ul class="links collapse " ${ isNormalMode ? 'id="modules-links"' : 'id="xs-modules-links"' }>
                            <li class="link">
                                <a href="modules/AppModule.html" data-type="entity-link">AppModule</a>
                                    <li class="chapter inner">
                                        <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ?
                                            'data-target="#components-links-module-AppModule-3dd38d25ad9148c0ac6e975a4e0601e7"' : 'data-target="#xs-components-links-module-AppModule-3dd38d25ad9148c0ac6e975a4e0601e7"' }>
                                            <span class="icon ion-md-cog"></span>
                                            <span>Components</span>
                                            <span class="icon ion-ios-arrow-down"></span>
                                        </div>
                                        <ul class="links collapse" ${ isNormalMode ? 'id="components-links-module-AppModule-3dd38d25ad9148c0ac6e975a4e0601e7"' :
                                            'id="xs-components-links-module-AppModule-3dd38d25ad9148c0ac6e975a4e0601e7"' }>
                                            <li class="link">
                                                <a href="components/AboutComponent.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">AboutComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/AlojamientoComponent.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">AlojamientoComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/AppComponent.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">AppComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/ContactComponent.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">ContactComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/DashboardComponent.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">DashboardComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/HomeComponent.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">HomeComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/LoginComponent.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">LoginComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/NoencontradoComponent.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">NoencontradoComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/PaneldeControlComponent.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">PaneldeControlComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/RegistrarComponent.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">RegistrarComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/ReservasComponent.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">ReservasComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/ReservasLoginComponent.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">ReservasLoginComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/ReservasRegistrarComponent.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">ReservasRegistrarComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/ReservasUsuarioComponent.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">ReservasUsuarioComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/UsuarioComponent.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">UsuarioComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/confirmacion.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">confirmacion</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/confirmacionReserva.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">confirmacionReserva</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/confirmacionServicio.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">confirmacionServicio</a>
                                            </li>
                                        </ul>
                                    </li>
                            </li>
                            <li class="link">
                                <a href="modules/AppRoutingModule.html" data-type="entity-link">AppRoutingModule</a>
                            </li>
                            <li class="link">
                                <a href="modules/MaterialModule.html" data-type="entity-link">MaterialModule</a>
                            </li>
                </ul>
                </li>
                    <li class="chapter">
                        <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ? 'data-target="#classes-links"' :
                            'data-target="#xs-classes-links"' }>
                            <span class="icon ion-ios-paper"></span>
                            <span>Classes</span>
                            <span class="icon ion-ios-arrow-down"></span>
                        </div>
                        <ul class="links collapse " ${ isNormalMode ? 'id="classes-links"' : 'id="xs-classes-links"' }>
                            <li class="link">
                                <a href="classes/Alojamiento.html" data-type="entity-link">Alojamiento</a>
                            </li>
                            <li class="link">
                                <a href="classes/Usuario.html" data-type="entity-link">Usuario</a>
                            </li>
                        </ul>
                    </li>
                    <li class="chapter">
                        <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ? 'data-target="#interfaces-links"' :
                            'data-target="#xs-interfaces-links"' }>
                            <span class="icon ion-md-information-circle-outline"></span>
                            <span>Interfaces</span>
                            <span class="icon ion-ios-arrow-down"></span>
                        </div>
                        <ul class="links collapse " ${ isNormalMode ? ' id="interfaces-links"' : 'id="xs-interfaces-links"' }>
                            <li class="link">
                                <a href="interfaces/DialogData.html" data-type="entity-link">DialogData</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/DialogData-1.html" data-type="entity-link">DialogData</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/DialogData-2.html" data-type="entity-link">DialogData</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/Tile.html" data-type="entity-link">Tile</a>
                            </li>
                        </ul>
                    </li>
                    <li class="chapter">
                        <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ? 'data-target="#miscellaneous-links"'
                            : 'data-target="#xs-miscellaneous-links"' }>
                            <span class="icon ion-ios-cube"></span>
                            <span>Miscellaneous</span>
                            <span class="icon ion-ios-arrow-down"></span>
                        </div>
                        <ul class="links collapse " ${ isNormalMode ? 'id="miscellaneous-links"' : 'id="xs-miscellaneous-links"' }>
                            <li class="link">
                                <a href="miscellaneous/functions.html" data-type="entity-link">Functions</a>
                            </li>
                            <li class="link">
                                <a href="miscellaneous/variables.html" data-type="entity-link">Variables</a>
                            </li>
                        </ul>
                    </li>
                        <li class="chapter">
                            <a data-type="chapter-link" href="routes.html"><span class="icon ion-ios-git-branch"></span>Routes</a>
                        </li>
                    <li class="chapter">
                        <a data-type="chapter-link" href="coverage.html"><span class="icon ion-ios-stats"></span>Documentation coverage</a>
                    </li>
                    <li class="divider"></li>
                    <li class="copyright">
                        Documentation generated using <a href="https://compodoc.app/" target="_blank">
                            <img data-src="images/compodoc-vectorise.png" class="img-responsive" data-type="compodoc-logo">
                        </a>
                    </li>
            </ul>
        </nav>
        `);
        this.innerHTML = tp.strings;
    }
});