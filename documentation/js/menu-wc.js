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
                    <a href="index.html" data-type="index-link">tlcn-server documentation</a>
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
                                <li class="link">
                                    <a href="properties.html" data-type="chapter-link">
                                        <span class="icon ion-ios-apps"></span>Properties
                                    </a>
                                </li>
                    </ul>
                </li>
                    <li class="chapter modules">
                        <a data-type="chapter-link" href="modules.html">
                            <div class="menu-toggler linked" data-bs-toggle="collapse" ${ isNormalMode ?
                                'data-bs-target="#modules-links"' : 'data-bs-target="#xs-modules-links"' }>
                                <span class="icon ion-ios-archive"></span>
                                <span class="link-name">Modules</span>
                                <span class="icon ion-ios-arrow-down"></span>
                            </div>
                        </a>
                        <ul class="links collapse " ${ isNormalMode ? 'id="modules-links"' : 'id="xs-modules-links"' }>
                            <li class="link">
                                <a href="modules/AppModule.html" data-type="entity-link" >AppModule</a>
                                    <li class="chapter inner">
                                        <div class="simple menu-toggler" data-bs-toggle="collapse" ${ isNormalMode ?
                                            'data-bs-target="#controllers-links-module-AppModule-db8399874f0ff84dc6261383d29646f64f40daa3890c8d7cffa3fbb325c6d257669e22d0eab15cea9d24f452c13e5d1774f78b0b4b5a1ffcbbcb1b3ff9afd2a5"' : 'data-bs-target="#xs-controllers-links-module-AppModule-db8399874f0ff84dc6261383d29646f64f40daa3890c8d7cffa3fbb325c6d257669e22d0eab15cea9d24f452c13e5d1774f78b0b4b5a1ffcbbcb1b3ff9afd2a5"' }>
                                            <span class="icon ion-md-swap"></span>
                                            <span>Controllers</span>
                                            <span class="icon ion-ios-arrow-down"></span>
                                        </div>
                                        <ul class="links collapse" ${ isNormalMode ? 'id="controllers-links-module-AppModule-db8399874f0ff84dc6261383d29646f64f40daa3890c8d7cffa3fbb325c6d257669e22d0eab15cea9d24f452c13e5d1774f78b0b4b5a1ffcbbcb1b3ff9afd2a5"' :
                                            'id="xs-controllers-links-module-AppModule-db8399874f0ff84dc6261383d29646f64f40daa3890c8d7cffa3fbb325c6d257669e22d0eab15cea9d24f452c13e5d1774f78b0b4b5a1ffcbbcb1b3ff9afd2a5"' }>
                                            <li class="link">
                                                <a href="controllers/AppController.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >AppController</a>
                                            </li>
                                        </ul>
                                    </li>
                                <li class="chapter inner">
                                    <div class="simple menu-toggler" data-bs-toggle="collapse" ${ isNormalMode ?
                                        'data-bs-target="#injectables-links-module-AppModule-db8399874f0ff84dc6261383d29646f64f40daa3890c8d7cffa3fbb325c6d257669e22d0eab15cea9d24f452c13e5d1774f78b0b4b5a1ffcbbcb1b3ff9afd2a5"' : 'data-bs-target="#xs-injectables-links-module-AppModule-db8399874f0ff84dc6261383d29646f64f40daa3890c8d7cffa3fbb325c6d257669e22d0eab15cea9d24f452c13e5d1774f78b0b4b5a1ffcbbcb1b3ff9afd2a5"' }>
                                        <span class="icon ion-md-arrow-round-down"></span>
                                        <span>Injectables</span>
                                        <span class="icon ion-ios-arrow-down"></span>
                                    </div>
                                    <ul class="links collapse" ${ isNormalMode ? 'id="injectables-links-module-AppModule-db8399874f0ff84dc6261383d29646f64f40daa3890c8d7cffa3fbb325c6d257669e22d0eab15cea9d24f452c13e5d1774f78b0b4b5a1ffcbbcb1b3ff9afd2a5"' :
                                        'id="xs-injectables-links-module-AppModule-db8399874f0ff84dc6261383d29646f64f40daa3890c8d7cffa3fbb325c6d257669e22d0eab15cea9d24f452c13e5d1774f78b0b4b5a1ffcbbcb1b3ff9afd2a5"' }>
                                        <li class="link">
                                            <a href="injectables/AppService.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >AppService</a>
                                        </li>
                                        <li class="link">
                                            <a href="injectables/PrismaService.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >PrismaService</a>
                                        </li>
                                    </ul>
                                </li>
                            </li>
                            <li class="link">
                                <a href="modules/AttachmentModule.html" data-type="entity-link" >AttachmentModule</a>
                                    <li class="chapter inner">
                                        <div class="simple menu-toggler" data-bs-toggle="collapse" ${ isNormalMode ?
                                            'data-bs-target="#controllers-links-module-AttachmentModule-6407ff6fc4b4b79827d03b0a29f9d588c452a5a1d1013c3295b692059489795de984316cb743ce37a4bf8f4496a0436cac1f4a7a7da1889fbc428c569e90f739"' : 'data-bs-target="#xs-controllers-links-module-AttachmentModule-6407ff6fc4b4b79827d03b0a29f9d588c452a5a1d1013c3295b692059489795de984316cb743ce37a4bf8f4496a0436cac1f4a7a7da1889fbc428c569e90f739"' }>
                                            <span class="icon ion-md-swap"></span>
                                            <span>Controllers</span>
                                            <span class="icon ion-ios-arrow-down"></span>
                                        </div>
                                        <ul class="links collapse" ${ isNormalMode ? 'id="controllers-links-module-AttachmentModule-6407ff6fc4b4b79827d03b0a29f9d588c452a5a1d1013c3295b692059489795de984316cb743ce37a4bf8f4496a0436cac1f4a7a7da1889fbc428c569e90f739"' :
                                            'id="xs-controllers-links-module-AttachmentModule-6407ff6fc4b4b79827d03b0a29f9d588c452a5a1d1013c3295b692059489795de984316cb743ce37a4bf8f4496a0436cac1f4a7a7da1889fbc428c569e90f739"' }>
                                            <li class="link">
                                                <a href="controllers/AttachmentController.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >AttachmentController</a>
                                            </li>
                                        </ul>
                                    </li>
                                <li class="chapter inner">
                                    <div class="simple menu-toggler" data-bs-toggle="collapse" ${ isNormalMode ?
                                        'data-bs-target="#injectables-links-module-AttachmentModule-6407ff6fc4b4b79827d03b0a29f9d588c452a5a1d1013c3295b692059489795de984316cb743ce37a4bf8f4496a0436cac1f4a7a7da1889fbc428c569e90f739"' : 'data-bs-target="#xs-injectables-links-module-AttachmentModule-6407ff6fc4b4b79827d03b0a29f9d588c452a5a1d1013c3295b692059489795de984316cb743ce37a4bf8f4496a0436cac1f4a7a7da1889fbc428c569e90f739"' }>
                                        <span class="icon ion-md-arrow-round-down"></span>
                                        <span>Injectables</span>
                                        <span class="icon ion-ios-arrow-down"></span>
                                    </div>
                                    <ul class="links collapse" ${ isNormalMode ? 'id="injectables-links-module-AttachmentModule-6407ff6fc4b4b79827d03b0a29f9d588c452a5a1d1013c3295b692059489795de984316cb743ce37a4bf8f4496a0436cac1f4a7a7da1889fbc428c569e90f739"' :
                                        'id="xs-injectables-links-module-AttachmentModule-6407ff6fc4b4b79827d03b0a29f9d588c452a5a1d1013c3295b692059489795de984316cb743ce37a4bf8f4496a0436cac1f4a7a7da1889fbc428c569e90f739"' }>
                                        <li class="link">
                                            <a href="injectables/AttachmentService.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >AttachmentService</a>
                                        </li>
                                        <li class="link">
                                            <a href="injectables/PrismaService.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >PrismaService</a>
                                        </li>
                                        <li class="link">
                                            <a href="injectables/UploadService.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >UploadService</a>
                                        </li>
                                    </ul>
                                </li>
                            </li>
                            <li class="link">
                                <a href="modules/AuthModule.html" data-type="entity-link" >AuthModule</a>
                                    <li class="chapter inner">
                                        <div class="simple menu-toggler" data-bs-toggle="collapse" ${ isNormalMode ?
                                            'data-bs-target="#controllers-links-module-AuthModule-43df219a8b996e9679722d9c93c2ac3acd25fd4f0bb02b9aac9e05f07e195195daab4bd9cfddc9a0eb014d7bfbd655a194ebea67c234e61d3a75db62e0c53eb4"' : 'data-bs-target="#xs-controllers-links-module-AuthModule-43df219a8b996e9679722d9c93c2ac3acd25fd4f0bb02b9aac9e05f07e195195daab4bd9cfddc9a0eb014d7bfbd655a194ebea67c234e61d3a75db62e0c53eb4"' }>
                                            <span class="icon ion-md-swap"></span>
                                            <span>Controllers</span>
                                            <span class="icon ion-ios-arrow-down"></span>
                                        </div>
                                        <ul class="links collapse" ${ isNormalMode ? 'id="controllers-links-module-AuthModule-43df219a8b996e9679722d9c93c2ac3acd25fd4f0bb02b9aac9e05f07e195195daab4bd9cfddc9a0eb014d7bfbd655a194ebea67c234e61d3a75db62e0c53eb4"' :
                                            'id="xs-controllers-links-module-AuthModule-43df219a8b996e9679722d9c93c2ac3acd25fd4f0bb02b9aac9e05f07e195195daab4bd9cfddc9a0eb014d7bfbd655a194ebea67c234e61d3a75db62e0c53eb4"' }>
                                            <li class="link">
                                                <a href="controllers/AuthController.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >AuthController</a>
                                            </li>
                                        </ul>
                                    </li>
                                <li class="chapter inner">
                                    <div class="simple menu-toggler" data-bs-toggle="collapse" ${ isNormalMode ?
                                        'data-bs-target="#injectables-links-module-AuthModule-43df219a8b996e9679722d9c93c2ac3acd25fd4f0bb02b9aac9e05f07e195195daab4bd9cfddc9a0eb014d7bfbd655a194ebea67c234e61d3a75db62e0c53eb4"' : 'data-bs-target="#xs-injectables-links-module-AuthModule-43df219a8b996e9679722d9c93c2ac3acd25fd4f0bb02b9aac9e05f07e195195daab4bd9cfddc9a0eb014d7bfbd655a194ebea67c234e61d3a75db62e0c53eb4"' }>
                                        <span class="icon ion-md-arrow-round-down"></span>
                                        <span>Injectables</span>
                                        <span class="icon ion-ios-arrow-down"></span>
                                    </div>
                                    <ul class="links collapse" ${ isNormalMode ? 'id="injectables-links-module-AuthModule-43df219a8b996e9679722d9c93c2ac3acd25fd4f0bb02b9aac9e05f07e195195daab4bd9cfddc9a0eb014d7bfbd655a194ebea67c234e61d3a75db62e0c53eb4"' :
                                        'id="xs-injectables-links-module-AuthModule-43df219a8b996e9679722d9c93c2ac3acd25fd4f0bb02b9aac9e05f07e195195daab4bd9cfddc9a0eb014d7bfbd655a194ebea67c234e61d3a75db62e0c53eb4"' }>
                                        <li class="link">
                                            <a href="injectables/AuthService.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >AuthService</a>
                                        </li>
                                        <li class="link">
                                            <a href="injectables/MailingService.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >MailingService</a>
                                        </li>
                                        <li class="link">
                                            <a href="injectables/PrismaService.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >PrismaService</a>
                                        </li>
                                    </ul>
                                </li>
                            </li>
                            <li class="link">
                                <a href="modules/ChapterModule.html" data-type="entity-link" >ChapterModule</a>
                                    <li class="chapter inner">
                                        <div class="simple menu-toggler" data-bs-toggle="collapse" ${ isNormalMode ?
                                            'data-bs-target="#controllers-links-module-ChapterModule-2b24d12a71e5330e482ce1fd65515225c32e452be239f18840dc1a5500d15a9cbe836e29f9045e3c5c33a79ed46834637b0aea5997abd714f3c1e9b02543664e"' : 'data-bs-target="#xs-controllers-links-module-ChapterModule-2b24d12a71e5330e482ce1fd65515225c32e452be239f18840dc1a5500d15a9cbe836e29f9045e3c5c33a79ed46834637b0aea5997abd714f3c1e9b02543664e"' }>
                                            <span class="icon ion-md-swap"></span>
                                            <span>Controllers</span>
                                            <span class="icon ion-ios-arrow-down"></span>
                                        </div>
                                        <ul class="links collapse" ${ isNormalMode ? 'id="controllers-links-module-ChapterModule-2b24d12a71e5330e482ce1fd65515225c32e452be239f18840dc1a5500d15a9cbe836e29f9045e3c5c33a79ed46834637b0aea5997abd714f3c1e9b02543664e"' :
                                            'id="xs-controllers-links-module-ChapterModule-2b24d12a71e5330e482ce1fd65515225c32e452be239f18840dc1a5500d15a9cbe836e29f9045e3c5c33a79ed46834637b0aea5997abd714f3c1e9b02543664e"' }>
                                            <li class="link">
                                                <a href="controllers/ChapterController.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >ChapterController</a>
                                            </li>
                                        </ul>
                                    </li>
                                <li class="chapter inner">
                                    <div class="simple menu-toggler" data-bs-toggle="collapse" ${ isNormalMode ?
                                        'data-bs-target="#injectables-links-module-ChapterModule-2b24d12a71e5330e482ce1fd65515225c32e452be239f18840dc1a5500d15a9cbe836e29f9045e3c5c33a79ed46834637b0aea5997abd714f3c1e9b02543664e"' : 'data-bs-target="#xs-injectables-links-module-ChapterModule-2b24d12a71e5330e482ce1fd65515225c32e452be239f18840dc1a5500d15a9cbe836e29f9045e3c5c33a79ed46834637b0aea5997abd714f3c1e9b02543664e"' }>
                                        <span class="icon ion-md-arrow-round-down"></span>
                                        <span>Injectables</span>
                                        <span class="icon ion-ios-arrow-down"></span>
                                    </div>
                                    <ul class="links collapse" ${ isNormalMode ? 'id="injectables-links-module-ChapterModule-2b24d12a71e5330e482ce1fd65515225c32e452be239f18840dc1a5500d15a9cbe836e29f9045e3c5c33a79ed46834637b0aea5997abd714f3c1e9b02543664e"' :
                                        'id="xs-injectables-links-module-ChapterModule-2b24d12a71e5330e482ce1fd65515225c32e452be239f18840dc1a5500d15a9cbe836e29f9045e3c5c33a79ed46834637b0aea5997abd714f3c1e9b02543664e"' }>
                                        <li class="link">
                                            <a href="injectables/ChapterService.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >ChapterService</a>
                                        </li>
                                        <li class="link">
                                            <a href="injectables/PrismaService.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >PrismaService</a>
                                        </li>
                                    </ul>
                                </li>
                            </li>
                            <li class="link">
                                <a href="modules/ChatgptModule.html" data-type="entity-link" >ChatgptModule</a>
                                    <li class="chapter inner">
                                        <div class="simple menu-toggler" data-bs-toggle="collapse" ${ isNormalMode ?
                                            'data-bs-target="#controllers-links-module-ChatgptModule-8f82702b717ddd2028506d65ba4b5c799e56513146f7078b7ba7e58d71f2a6a3d06b6d0f2248cf91c6db98f51200f5751a11654a3c8121d3a217d28ff032703d"' : 'data-bs-target="#xs-controllers-links-module-ChatgptModule-8f82702b717ddd2028506d65ba4b5c799e56513146f7078b7ba7e58d71f2a6a3d06b6d0f2248cf91c6db98f51200f5751a11654a3c8121d3a217d28ff032703d"' }>
                                            <span class="icon ion-md-swap"></span>
                                            <span>Controllers</span>
                                            <span class="icon ion-ios-arrow-down"></span>
                                        </div>
                                        <ul class="links collapse" ${ isNormalMode ? 'id="controllers-links-module-ChatgptModule-8f82702b717ddd2028506d65ba4b5c799e56513146f7078b7ba7e58d71f2a6a3d06b6d0f2248cf91c6db98f51200f5751a11654a3c8121d3a217d28ff032703d"' :
                                            'id="xs-controllers-links-module-ChatgptModule-8f82702b717ddd2028506d65ba4b5c799e56513146f7078b7ba7e58d71f2a6a3d06b6d0f2248cf91c6db98f51200f5751a11654a3c8121d3a217d28ff032703d"' }>
                                            <li class="link">
                                                <a href="controllers/ChatgptController.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >ChatgptController</a>
                                            </li>
                                        </ul>
                                    </li>
                                <li class="chapter inner">
                                    <div class="simple menu-toggler" data-bs-toggle="collapse" ${ isNormalMode ?
                                        'data-bs-target="#injectables-links-module-ChatgptModule-8f82702b717ddd2028506d65ba4b5c799e56513146f7078b7ba7e58d71f2a6a3d06b6d0f2248cf91c6db98f51200f5751a11654a3c8121d3a217d28ff032703d"' : 'data-bs-target="#xs-injectables-links-module-ChatgptModule-8f82702b717ddd2028506d65ba4b5c799e56513146f7078b7ba7e58d71f2a6a3d06b6d0f2248cf91c6db98f51200f5751a11654a3c8121d3a217d28ff032703d"' }>
                                        <span class="icon ion-md-arrow-round-down"></span>
                                        <span>Injectables</span>
                                        <span class="icon ion-ios-arrow-down"></span>
                                    </div>
                                    <ul class="links collapse" ${ isNormalMode ? 'id="injectables-links-module-ChatgptModule-8f82702b717ddd2028506d65ba4b5c799e56513146f7078b7ba7e58d71f2a6a3d06b6d0f2248cf91c6db98f51200f5751a11654a3c8121d3a217d28ff032703d"' :
                                        'id="xs-injectables-links-module-ChatgptModule-8f82702b717ddd2028506d65ba4b5c799e56513146f7078b7ba7e58d71f2a6a3d06b6d0f2248cf91c6db98f51200f5751a11654a3c8121d3a217d28ff032703d"' }>
                                        <li class="link">
                                            <a href="injectables/ChatgptService.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >ChatgptService</a>
                                        </li>
                                        <li class="link">
                                            <a href="injectables/PrismaService.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >PrismaService</a>
                                        </li>
                                        <li class="link">
                                            <a href="injectables/QuizzService.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >QuizzService</a>
                                        </li>
                                        <li class="link">
                                            <a href="injectables/UploadService.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >UploadService</a>
                                        </li>
                                    </ul>
                                </li>
                            </li>
                            <li class="link">
                                <a href="modules/CodeModule.html" data-type="entity-link" >CodeModule</a>
                                    <li class="chapter inner">
                                        <div class="simple menu-toggler" data-bs-toggle="collapse" ${ isNormalMode ?
                                            'data-bs-target="#controllers-links-module-CodeModule-9a79f05ef7e542cdaf02a7a602f21d4ecdbd15b7ace915d802830f7810621da6f69d7c4bbcb0c95a9974cdc3b8f6ad15edbff7d0247516a9900264156db3b008"' : 'data-bs-target="#xs-controllers-links-module-CodeModule-9a79f05ef7e542cdaf02a7a602f21d4ecdbd15b7ace915d802830f7810621da6f69d7c4bbcb0c95a9974cdc3b8f6ad15edbff7d0247516a9900264156db3b008"' }>
                                            <span class="icon ion-md-swap"></span>
                                            <span>Controllers</span>
                                            <span class="icon ion-ios-arrow-down"></span>
                                        </div>
                                        <ul class="links collapse" ${ isNormalMode ? 'id="controllers-links-module-CodeModule-9a79f05ef7e542cdaf02a7a602f21d4ecdbd15b7ace915d802830f7810621da6f69d7c4bbcb0c95a9974cdc3b8f6ad15edbff7d0247516a9900264156db3b008"' :
                                            'id="xs-controllers-links-module-CodeModule-9a79f05ef7e542cdaf02a7a602f21d4ecdbd15b7ace915d802830f7810621da6f69d7c4bbcb0c95a9974cdc3b8f6ad15edbff7d0247516a9900264156db3b008"' }>
                                            <li class="link">
                                                <a href="controllers/CodeController.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >CodeController</a>
                                            </li>
                                            <li class="link">
                                                <a href="controllers/CodeControllerUser.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >CodeControllerUser</a>
                                            </li>
                                        </ul>
                                    </li>
                                <li class="chapter inner">
                                    <div class="simple menu-toggler" data-bs-toggle="collapse" ${ isNormalMode ?
                                        'data-bs-target="#injectables-links-module-CodeModule-9a79f05ef7e542cdaf02a7a602f21d4ecdbd15b7ace915d802830f7810621da6f69d7c4bbcb0c95a9974cdc3b8f6ad15edbff7d0247516a9900264156db3b008"' : 'data-bs-target="#xs-injectables-links-module-CodeModule-9a79f05ef7e542cdaf02a7a602f21d4ecdbd15b7ace915d802830f7810621da6f69d7c4bbcb0c95a9974cdc3b8f6ad15edbff7d0247516a9900264156db3b008"' }>
                                        <span class="icon ion-md-arrow-round-down"></span>
                                        <span>Injectables</span>
                                        <span class="icon ion-ios-arrow-down"></span>
                                    </div>
                                    <ul class="links collapse" ${ isNormalMode ? 'id="injectables-links-module-CodeModule-9a79f05ef7e542cdaf02a7a602f21d4ecdbd15b7ace915d802830f7810621da6f69d7c4bbcb0c95a9974cdc3b8f6ad15edbff7d0247516a9900264156db3b008"' :
                                        'id="xs-injectables-links-module-CodeModule-9a79f05ef7e542cdaf02a7a602f21d4ecdbd15b7ace915d802830f7810621da6f69d7c4bbcb0c95a9974cdc3b8f6ad15edbff7d0247516a9900264156db3b008"' }>
                                        <li class="link">
                                            <a href="injectables/CodeService.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >CodeService</a>
                                        </li>
                                        <li class="link">
                                            <a href="injectables/EvaluateService.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >EvaluateService</a>
                                        </li>
                                        <li class="link">
                                            <a href="injectables/PrismaService.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >PrismaService</a>
                                        </li>
                                        <li class="link">
                                            <a href="injectables/QuizzService.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >QuizzService</a>
                                        </li>
                                    </ul>
                                </li>
                            </li>
                            <li class="link">
                                <a href="modules/CourseModule.html" data-type="entity-link" >CourseModule</a>
                                    <li class="chapter inner">
                                        <div class="simple menu-toggler" data-bs-toggle="collapse" ${ isNormalMode ?
                                            'data-bs-target="#controllers-links-module-CourseModule-0fbd1524c27fb9714bc25516bbf84affccf3d25dce5a0668b35a96dac123a7077dbf66c726194fac5732c563b519239c143eb5468d8cb8c701639894657ff6f9"' : 'data-bs-target="#xs-controllers-links-module-CourseModule-0fbd1524c27fb9714bc25516bbf84affccf3d25dce5a0668b35a96dac123a7077dbf66c726194fac5732c563b519239c143eb5468d8cb8c701639894657ff6f9"' }>
                                            <span class="icon ion-md-swap"></span>
                                            <span>Controllers</span>
                                            <span class="icon ion-ios-arrow-down"></span>
                                        </div>
                                        <ul class="links collapse" ${ isNormalMode ? 'id="controllers-links-module-CourseModule-0fbd1524c27fb9714bc25516bbf84affccf3d25dce5a0668b35a96dac123a7077dbf66c726194fac5732c563b519239c143eb5468d8cb8c701639894657ff6f9"' :
                                            'id="xs-controllers-links-module-CourseModule-0fbd1524c27fb9714bc25516bbf84affccf3d25dce5a0668b35a96dac123a7077dbf66c726194fac5732c563b519239c143eb5468d8cb8c701639894657ff6f9"' }>
                                            <li class="link">
                                                <a href="controllers/CourseController.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >CourseController</a>
                                            </li>
                                        </ul>
                                    </li>
                                <li class="chapter inner">
                                    <div class="simple menu-toggler" data-bs-toggle="collapse" ${ isNormalMode ?
                                        'data-bs-target="#injectables-links-module-CourseModule-0fbd1524c27fb9714bc25516bbf84affccf3d25dce5a0668b35a96dac123a7077dbf66c726194fac5732c563b519239c143eb5468d8cb8c701639894657ff6f9"' : 'data-bs-target="#xs-injectables-links-module-CourseModule-0fbd1524c27fb9714bc25516bbf84affccf3d25dce5a0668b35a96dac123a7077dbf66c726194fac5732c563b519239c143eb5468d8cb8c701639894657ff6f9"' }>
                                        <span class="icon ion-md-arrow-round-down"></span>
                                        <span>Injectables</span>
                                        <span class="icon ion-ios-arrow-down"></span>
                                    </div>
                                    <ul class="links collapse" ${ isNormalMode ? 'id="injectables-links-module-CourseModule-0fbd1524c27fb9714bc25516bbf84affccf3d25dce5a0668b35a96dac123a7077dbf66c726194fac5732c563b519239c143eb5468d8cb8c701639894657ff6f9"' :
                                        'id="xs-injectables-links-module-CourseModule-0fbd1524c27fb9714bc25516bbf84affccf3d25dce5a0668b35a96dac123a7077dbf66c726194fac5732c563b519239c143eb5468d8cb8c701639894657ff6f9"' }>
                                        <li class="link">
                                            <a href="injectables/CourseService.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >CourseService</a>
                                        </li>
                                        <li class="link">
                                            <a href="injectables/PrismaService.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >PrismaService</a>
                                        </li>
                                        <li class="link">
                                            <a href="injectables/UploadService.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >UploadService</a>
                                        </li>
                                    </ul>
                                </li>
                            </li>
                            <li class="link">
                                <a href="modules/EvaluateModule.html" data-type="entity-link" >EvaluateModule</a>
                                    <li class="chapter inner">
                                        <div class="simple menu-toggler" data-bs-toggle="collapse" ${ isNormalMode ?
                                            'data-bs-target="#controllers-links-module-EvaluateModule-ceaa8a2885a6d473698fe45f7990cdc07463f566c41f414029d32d04a7ad8355ada416d51fc783416fc82df4ccc13f533ea0ef91d829e64b05cc10d3cbaf158a"' : 'data-bs-target="#xs-controllers-links-module-EvaluateModule-ceaa8a2885a6d473698fe45f7990cdc07463f566c41f414029d32d04a7ad8355ada416d51fc783416fc82df4ccc13f533ea0ef91d829e64b05cc10d3cbaf158a"' }>
                                            <span class="icon ion-md-swap"></span>
                                            <span>Controllers</span>
                                            <span class="icon ion-ios-arrow-down"></span>
                                        </div>
                                        <ul class="links collapse" ${ isNormalMode ? 'id="controllers-links-module-EvaluateModule-ceaa8a2885a6d473698fe45f7990cdc07463f566c41f414029d32d04a7ad8355ada416d51fc783416fc82df4ccc13f533ea0ef91d829e64b05cc10d3cbaf158a"' :
                                            'id="xs-controllers-links-module-EvaluateModule-ceaa8a2885a6d473698fe45f7990cdc07463f566c41f414029d32d04a7ad8355ada416d51fc783416fc82df4ccc13f533ea0ef91d829e64b05cc10d3cbaf158a"' }>
                                            <li class="link">
                                                <a href="controllers/EvaluateController.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >EvaluateController</a>
                                            </li>
                                            <li class="link">
                                                <a href="controllers/EvaluatesController.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >EvaluatesController</a>
                                            </li>
                                        </ul>
                                    </li>
                                <li class="chapter inner">
                                    <div class="simple menu-toggler" data-bs-toggle="collapse" ${ isNormalMode ?
                                        'data-bs-target="#injectables-links-module-EvaluateModule-ceaa8a2885a6d473698fe45f7990cdc07463f566c41f414029d32d04a7ad8355ada416d51fc783416fc82df4ccc13f533ea0ef91d829e64b05cc10d3cbaf158a"' : 'data-bs-target="#xs-injectables-links-module-EvaluateModule-ceaa8a2885a6d473698fe45f7990cdc07463f566c41f414029d32d04a7ad8355ada416d51fc783416fc82df4ccc13f533ea0ef91d829e64b05cc10d3cbaf158a"' }>
                                        <span class="icon ion-md-arrow-round-down"></span>
                                        <span>Injectables</span>
                                        <span class="icon ion-ios-arrow-down"></span>
                                    </div>
                                    <ul class="links collapse" ${ isNormalMode ? 'id="injectables-links-module-EvaluateModule-ceaa8a2885a6d473698fe45f7990cdc07463f566c41f414029d32d04a7ad8355ada416d51fc783416fc82df4ccc13f533ea0ef91d829e64b05cc10d3cbaf158a"' :
                                        'id="xs-injectables-links-module-EvaluateModule-ceaa8a2885a6d473698fe45f7990cdc07463f566c41f414029d32d04a7ad8355ada416d51fc783416fc82df4ccc13f533ea0ef91d829e64b05cc10d3cbaf158a"' }>
                                        <li class="link">
                                            <a href="injectables/EvaluateService.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >EvaluateService</a>
                                        </li>
                                        <li class="link">
                                            <a href="injectables/PrismaService.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >PrismaService</a>
                                        </li>
                                        <li class="link">
                                            <a href="injectables/QuizzService.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >QuizzService</a>
                                        </li>
                                    </ul>
                                </li>
                            </li>
                            <li class="link">
                                <a href="modules/ExerciseModule.html" data-type="entity-link" >ExerciseModule</a>
                                    <li class="chapter inner">
                                        <div class="simple menu-toggler" data-bs-toggle="collapse" ${ isNormalMode ?
                                            'data-bs-target="#controllers-links-module-ExerciseModule-6ea6a6ad2ed35d182e899500a858e2c652c988bdbe40d5ead3cdc3eb935fe133c9c4b1baada8fa27b495a4bb5aa2deef60e287da2ce6511b330c17f55d8207da"' : 'data-bs-target="#xs-controllers-links-module-ExerciseModule-6ea6a6ad2ed35d182e899500a858e2c652c988bdbe40d5ead3cdc3eb935fe133c9c4b1baada8fa27b495a4bb5aa2deef60e287da2ce6511b330c17f55d8207da"' }>
                                            <span class="icon ion-md-swap"></span>
                                            <span>Controllers</span>
                                            <span class="icon ion-ios-arrow-down"></span>
                                        </div>
                                        <ul class="links collapse" ${ isNormalMode ? 'id="controllers-links-module-ExerciseModule-6ea6a6ad2ed35d182e899500a858e2c652c988bdbe40d5ead3cdc3eb935fe133c9c4b1baada8fa27b495a4bb5aa2deef60e287da2ce6511b330c17f55d8207da"' :
                                            'id="xs-controllers-links-module-ExerciseModule-6ea6a6ad2ed35d182e899500a858e2c652c988bdbe40d5ead3cdc3eb935fe133c9c4b1baada8fa27b495a4bb5aa2deef60e287da2ce6511b330c17f55d8207da"' }>
                                            <li class="link">
                                                <a href="controllers/ExerciseController.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >ExerciseController</a>
                                            </li>
                                        </ul>
                                    </li>
                                <li class="chapter inner">
                                    <div class="simple menu-toggler" data-bs-toggle="collapse" ${ isNormalMode ?
                                        'data-bs-target="#injectables-links-module-ExerciseModule-6ea6a6ad2ed35d182e899500a858e2c652c988bdbe40d5ead3cdc3eb935fe133c9c4b1baada8fa27b495a4bb5aa2deef60e287da2ce6511b330c17f55d8207da"' : 'data-bs-target="#xs-injectables-links-module-ExerciseModule-6ea6a6ad2ed35d182e899500a858e2c652c988bdbe40d5ead3cdc3eb935fe133c9c4b1baada8fa27b495a4bb5aa2deef60e287da2ce6511b330c17f55d8207da"' }>
                                        <span class="icon ion-md-arrow-round-down"></span>
                                        <span>Injectables</span>
                                        <span class="icon ion-ios-arrow-down"></span>
                                    </div>
                                    <ul class="links collapse" ${ isNormalMode ? 'id="injectables-links-module-ExerciseModule-6ea6a6ad2ed35d182e899500a858e2c652c988bdbe40d5ead3cdc3eb935fe133c9c4b1baada8fa27b495a4bb5aa2deef60e287da2ce6511b330c17f55d8207da"' :
                                        'id="xs-injectables-links-module-ExerciseModule-6ea6a6ad2ed35d182e899500a858e2c652c988bdbe40d5ead3cdc3eb935fe133c9c4b1baada8fa27b495a4bb5aa2deef60e287da2ce6511b330c17f55d8207da"' }>
                                        <li class="link">
                                            <a href="injectables/ExerciseService.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >ExerciseService</a>
                                        </li>
                                        <li class="link">
                                            <a href="injectables/PrismaService.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >PrismaService</a>
                                        </li>
                                    </ul>
                                </li>
                            </li>
                            <li class="link">
                                <a href="modules/LessonModule.html" data-type="entity-link" >LessonModule</a>
                                    <li class="chapter inner">
                                        <div class="simple menu-toggler" data-bs-toggle="collapse" ${ isNormalMode ?
                                            'data-bs-target="#controllers-links-module-LessonModule-632c9bbe358d4a664d0a63988207e6266f7d99666f64c28ee79d193c784e456bade39c9cfbd076861de6d546593c738c18f17618d01b0d51175f714208e120b3"' : 'data-bs-target="#xs-controllers-links-module-LessonModule-632c9bbe358d4a664d0a63988207e6266f7d99666f64c28ee79d193c784e456bade39c9cfbd076861de6d546593c738c18f17618d01b0d51175f714208e120b3"' }>
                                            <span class="icon ion-md-swap"></span>
                                            <span>Controllers</span>
                                            <span class="icon ion-ios-arrow-down"></span>
                                        </div>
                                        <ul class="links collapse" ${ isNormalMode ? 'id="controllers-links-module-LessonModule-632c9bbe358d4a664d0a63988207e6266f7d99666f64c28ee79d193c784e456bade39c9cfbd076861de6d546593c738c18f17618d01b0d51175f714208e120b3"' :
                                            'id="xs-controllers-links-module-LessonModule-632c9bbe358d4a664d0a63988207e6266f7d99666f64c28ee79d193c784e456bade39c9cfbd076861de6d546593c738c18f17618d01b0d51175f714208e120b3"' }>
                                            <li class="link">
                                                <a href="controllers/LessonController.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >LessonController</a>
                                            </li>
                                            <li class="link">
                                                <a href="controllers/LessonControllerUser.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >LessonControllerUser</a>
                                            </li>
                                        </ul>
                                    </li>
                                <li class="chapter inner">
                                    <div class="simple menu-toggler" data-bs-toggle="collapse" ${ isNormalMode ?
                                        'data-bs-target="#injectables-links-module-LessonModule-632c9bbe358d4a664d0a63988207e6266f7d99666f64c28ee79d193c784e456bade39c9cfbd076861de6d546593c738c18f17618d01b0d51175f714208e120b3"' : 'data-bs-target="#xs-injectables-links-module-LessonModule-632c9bbe358d4a664d0a63988207e6266f7d99666f64c28ee79d193c784e456bade39c9cfbd076861de6d546593c738c18f17618d01b0d51175f714208e120b3"' }>
                                        <span class="icon ion-md-arrow-round-down"></span>
                                        <span>Injectables</span>
                                        <span class="icon ion-ios-arrow-down"></span>
                                    </div>
                                    <ul class="links collapse" ${ isNormalMode ? 'id="injectables-links-module-LessonModule-632c9bbe358d4a664d0a63988207e6266f7d99666f64c28ee79d193c784e456bade39c9cfbd076861de6d546593c738c18f17618d01b0d51175f714208e120b3"' :
                                        'id="xs-injectables-links-module-LessonModule-632c9bbe358d4a664d0a63988207e6266f7d99666f64c28ee79d193c784e456bade39c9cfbd076861de6d546593c738c18f17618d01b0d51175f714208e120b3"' }>
                                        <li class="link">
                                            <a href="injectables/LessonService.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >LessonService</a>
                                        </li>
                                        <li class="link">
                                            <a href="injectables/PrismaService.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >PrismaService</a>
                                        </li>
                                        <li class="link">
                                            <a href="injectables/UploadService.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >UploadService</a>
                                        </li>
                                    </ul>
                                </li>
                            </li>
                            <li class="link">
                                <a href="modules/MailingModule.html" data-type="entity-link" >MailingModule</a>
                                    <li class="chapter inner">
                                        <div class="simple menu-toggler" data-bs-toggle="collapse" ${ isNormalMode ?
                                            'data-bs-target="#controllers-links-module-MailingModule-4f8dd3040459a0b558dcb2f50beb285dc88d64473ed73a3ef3a6a367cd09b53772b64329a37cfc1ecfb07899f242f1b7a0c77e129eac5e9380c3c08ae109642b"' : 'data-bs-target="#xs-controllers-links-module-MailingModule-4f8dd3040459a0b558dcb2f50beb285dc88d64473ed73a3ef3a6a367cd09b53772b64329a37cfc1ecfb07899f242f1b7a0c77e129eac5e9380c3c08ae109642b"' }>
                                            <span class="icon ion-md-swap"></span>
                                            <span>Controllers</span>
                                            <span class="icon ion-ios-arrow-down"></span>
                                        </div>
                                        <ul class="links collapse" ${ isNormalMode ? 'id="controllers-links-module-MailingModule-4f8dd3040459a0b558dcb2f50beb285dc88d64473ed73a3ef3a6a367cd09b53772b64329a37cfc1ecfb07899f242f1b7a0c77e129eac5e9380c3c08ae109642b"' :
                                            'id="xs-controllers-links-module-MailingModule-4f8dd3040459a0b558dcb2f50beb285dc88d64473ed73a3ef3a6a367cd09b53772b64329a37cfc1ecfb07899f242f1b7a0c77e129eac5e9380c3c08ae109642b"' }>
                                            <li class="link">
                                                <a href="controllers/MailingController.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >MailingController</a>
                                            </li>
                                        </ul>
                                    </li>
                                <li class="chapter inner">
                                    <div class="simple menu-toggler" data-bs-toggle="collapse" ${ isNormalMode ?
                                        'data-bs-target="#injectables-links-module-MailingModule-4f8dd3040459a0b558dcb2f50beb285dc88d64473ed73a3ef3a6a367cd09b53772b64329a37cfc1ecfb07899f242f1b7a0c77e129eac5e9380c3c08ae109642b"' : 'data-bs-target="#xs-injectables-links-module-MailingModule-4f8dd3040459a0b558dcb2f50beb285dc88d64473ed73a3ef3a6a367cd09b53772b64329a37cfc1ecfb07899f242f1b7a0c77e129eac5e9380c3c08ae109642b"' }>
                                        <span class="icon ion-md-arrow-round-down"></span>
                                        <span>Injectables</span>
                                        <span class="icon ion-ios-arrow-down"></span>
                                    </div>
                                    <ul class="links collapse" ${ isNormalMode ? 'id="injectables-links-module-MailingModule-4f8dd3040459a0b558dcb2f50beb285dc88d64473ed73a3ef3a6a367cd09b53772b64329a37cfc1ecfb07899f242f1b7a0c77e129eac5e9380c3c08ae109642b"' :
                                        'id="xs-injectables-links-module-MailingModule-4f8dd3040459a0b558dcb2f50beb285dc88d64473ed73a3ef3a6a367cd09b53772b64329a37cfc1ecfb07899f242f1b7a0c77e129eac5e9380c3c08ae109642b"' }>
                                        <li class="link">
                                            <a href="injectables/MailingService.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >MailingService</a>
                                        </li>
                                    </ul>
                                </li>
                            </li>
                            <li class="link">
                                <a href="modules/MessageModule.html" data-type="entity-link" >MessageModule</a>
                                    <li class="chapter inner">
                                        <div class="simple menu-toggler" data-bs-toggle="collapse" ${ isNormalMode ?
                                            'data-bs-target="#controllers-links-module-MessageModule-ea582a65348bfb86e8871c4a4777159a2918ca0261146cb686d1b2b494664acc4042992062493bde9261640a502bd120c7d7014d0415ea36b6db361e3eaebfd9"' : 'data-bs-target="#xs-controllers-links-module-MessageModule-ea582a65348bfb86e8871c4a4777159a2918ca0261146cb686d1b2b494664acc4042992062493bde9261640a502bd120c7d7014d0415ea36b6db361e3eaebfd9"' }>
                                            <span class="icon ion-md-swap"></span>
                                            <span>Controllers</span>
                                            <span class="icon ion-ios-arrow-down"></span>
                                        </div>
                                        <ul class="links collapse" ${ isNormalMode ? 'id="controllers-links-module-MessageModule-ea582a65348bfb86e8871c4a4777159a2918ca0261146cb686d1b2b494664acc4042992062493bde9261640a502bd120c7d7014d0415ea36b6db361e3eaebfd9"' :
                                            'id="xs-controllers-links-module-MessageModule-ea582a65348bfb86e8871c4a4777159a2918ca0261146cb686d1b2b494664acc4042992062493bde9261640a502bd120c7d7014d0415ea36b6db361e3eaebfd9"' }>
                                            <li class="link">
                                                <a href="controllers/MessageController.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >MessageController</a>
                                            </li>
                                        </ul>
                                    </li>
                                <li class="chapter inner">
                                    <div class="simple menu-toggler" data-bs-toggle="collapse" ${ isNormalMode ?
                                        'data-bs-target="#injectables-links-module-MessageModule-ea582a65348bfb86e8871c4a4777159a2918ca0261146cb686d1b2b494664acc4042992062493bde9261640a502bd120c7d7014d0415ea36b6db361e3eaebfd9"' : 'data-bs-target="#xs-injectables-links-module-MessageModule-ea582a65348bfb86e8871c4a4777159a2918ca0261146cb686d1b2b494664acc4042992062493bde9261640a502bd120c7d7014d0415ea36b6db361e3eaebfd9"' }>
                                        <span class="icon ion-md-arrow-round-down"></span>
                                        <span>Injectables</span>
                                        <span class="icon ion-ios-arrow-down"></span>
                                    </div>
                                    <ul class="links collapse" ${ isNormalMode ? 'id="injectables-links-module-MessageModule-ea582a65348bfb86e8871c4a4777159a2918ca0261146cb686d1b2b494664acc4042992062493bde9261640a502bd120c7d7014d0415ea36b6db361e3eaebfd9"' :
                                        'id="xs-injectables-links-module-MessageModule-ea582a65348bfb86e8871c4a4777159a2918ca0261146cb686d1b2b494664acc4042992062493bde9261640a502bd120c7d7014d0415ea36b6db361e3eaebfd9"' }>
                                        <li class="link">
                                            <a href="injectables/MessageService.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >MessageService</a>
                                        </li>
                                        <li class="link">
                                            <a href="injectables/PrismaService.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >PrismaService</a>
                                        </li>
                                        <li class="link">
                                            <a href="injectables/UploadService.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >UploadService</a>
                                        </li>
                                    </ul>
                                </li>
                            </li>
                            <li class="link">
                                <a href="modules/QuizzModule.html" data-type="entity-link" >QuizzModule</a>
                                    <li class="chapter inner">
                                        <div class="simple menu-toggler" data-bs-toggle="collapse" ${ isNormalMode ?
                                            'data-bs-target="#controllers-links-module-QuizzModule-40683820caa96fd567bcdc85ab86880cfa3c1a04d1465946027362324ccc739f1ce83b7125a3fed27f192a0b10aeabed2542996c8fb00cf6df8928de641df478"' : 'data-bs-target="#xs-controllers-links-module-QuizzModule-40683820caa96fd567bcdc85ab86880cfa3c1a04d1465946027362324ccc739f1ce83b7125a3fed27f192a0b10aeabed2542996c8fb00cf6df8928de641df478"' }>
                                            <span class="icon ion-md-swap"></span>
                                            <span>Controllers</span>
                                            <span class="icon ion-ios-arrow-down"></span>
                                        </div>
                                        <ul class="links collapse" ${ isNormalMode ? 'id="controllers-links-module-QuizzModule-40683820caa96fd567bcdc85ab86880cfa3c1a04d1465946027362324ccc739f1ce83b7125a3fed27f192a0b10aeabed2542996c8fb00cf6df8928de641df478"' :
                                            'id="xs-controllers-links-module-QuizzModule-40683820caa96fd567bcdc85ab86880cfa3c1a04d1465946027362324ccc739f1ce83b7125a3fed27f192a0b10aeabed2542996c8fb00cf6df8928de641df478"' }>
                                            <li class="link">
                                                <a href="controllers/QuizzController.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >QuizzController</a>
                                            </li>
                                        </ul>
                                    </li>
                                <li class="chapter inner">
                                    <div class="simple menu-toggler" data-bs-toggle="collapse" ${ isNormalMode ?
                                        'data-bs-target="#injectables-links-module-QuizzModule-40683820caa96fd567bcdc85ab86880cfa3c1a04d1465946027362324ccc739f1ce83b7125a3fed27f192a0b10aeabed2542996c8fb00cf6df8928de641df478"' : 'data-bs-target="#xs-injectables-links-module-QuizzModule-40683820caa96fd567bcdc85ab86880cfa3c1a04d1465946027362324ccc739f1ce83b7125a3fed27f192a0b10aeabed2542996c8fb00cf6df8928de641df478"' }>
                                        <span class="icon ion-md-arrow-round-down"></span>
                                        <span>Injectables</span>
                                        <span class="icon ion-ios-arrow-down"></span>
                                    </div>
                                    <ul class="links collapse" ${ isNormalMode ? 'id="injectables-links-module-QuizzModule-40683820caa96fd567bcdc85ab86880cfa3c1a04d1465946027362324ccc739f1ce83b7125a3fed27f192a0b10aeabed2542996c8fb00cf6df8928de641df478"' :
                                        'id="xs-injectables-links-module-QuizzModule-40683820caa96fd567bcdc85ab86880cfa3c1a04d1465946027362324ccc739f1ce83b7125a3fed27f192a0b10aeabed2542996c8fb00cf6df8928de641df478"' }>
                                        <li class="link">
                                            <a href="injectables/PrismaService.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >PrismaService</a>
                                        </li>
                                        <li class="link">
                                            <a href="injectables/QuizzService.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >QuizzService</a>
                                        </li>
                                    </ul>
                                </li>
                            </li>
                            <li class="link">
                                <a href="modules/RegisterInstructorModule.html" data-type="entity-link" >RegisterInstructorModule</a>
                                    <li class="chapter inner">
                                        <div class="simple menu-toggler" data-bs-toggle="collapse" ${ isNormalMode ?
                                            'data-bs-target="#controllers-links-module-RegisterInstructorModule-f48b93a64e1757c71c28b879ca5180e5af8c0b6949b0772e97faa03fabdf898dffef3b3665f879a185cf1a342a055f8fbf3ac764b1d9913ac56ab0cb41454933"' : 'data-bs-target="#xs-controllers-links-module-RegisterInstructorModule-f48b93a64e1757c71c28b879ca5180e5af8c0b6949b0772e97faa03fabdf898dffef3b3665f879a185cf1a342a055f8fbf3ac764b1d9913ac56ab0cb41454933"' }>
                                            <span class="icon ion-md-swap"></span>
                                            <span>Controllers</span>
                                            <span class="icon ion-ios-arrow-down"></span>
                                        </div>
                                        <ul class="links collapse" ${ isNormalMode ? 'id="controllers-links-module-RegisterInstructorModule-f48b93a64e1757c71c28b879ca5180e5af8c0b6949b0772e97faa03fabdf898dffef3b3665f879a185cf1a342a055f8fbf3ac764b1d9913ac56ab0cb41454933"' :
                                            'id="xs-controllers-links-module-RegisterInstructorModule-f48b93a64e1757c71c28b879ca5180e5af8c0b6949b0772e97faa03fabdf898dffef3b3665f879a185cf1a342a055f8fbf3ac764b1d9913ac56ab0cb41454933"' }>
                                            <li class="link">
                                                <a href="controllers/RegisterInstructorAdminController.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >RegisterInstructorAdminController</a>
                                            </li>
                                            <li class="link">
                                                <a href="controllers/RegisterInstructorController.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >RegisterInstructorController</a>
                                            </li>
                                        </ul>
                                    </li>
                                <li class="chapter inner">
                                    <div class="simple menu-toggler" data-bs-toggle="collapse" ${ isNormalMode ?
                                        'data-bs-target="#injectables-links-module-RegisterInstructorModule-f48b93a64e1757c71c28b879ca5180e5af8c0b6949b0772e97faa03fabdf898dffef3b3665f879a185cf1a342a055f8fbf3ac764b1d9913ac56ab0cb41454933"' : 'data-bs-target="#xs-injectables-links-module-RegisterInstructorModule-f48b93a64e1757c71c28b879ca5180e5af8c0b6949b0772e97faa03fabdf898dffef3b3665f879a185cf1a342a055f8fbf3ac764b1d9913ac56ab0cb41454933"' }>
                                        <span class="icon ion-md-arrow-round-down"></span>
                                        <span>Injectables</span>
                                        <span class="icon ion-ios-arrow-down"></span>
                                    </div>
                                    <ul class="links collapse" ${ isNormalMode ? 'id="injectables-links-module-RegisterInstructorModule-f48b93a64e1757c71c28b879ca5180e5af8c0b6949b0772e97faa03fabdf898dffef3b3665f879a185cf1a342a055f8fbf3ac764b1d9913ac56ab0cb41454933"' :
                                        'id="xs-injectables-links-module-RegisterInstructorModule-f48b93a64e1757c71c28b879ca5180e5af8c0b6949b0772e97faa03fabdf898dffef3b3665f879a185cf1a342a055f8fbf3ac764b1d9913ac56ab0cb41454933"' }>
                                        <li class="link">
                                            <a href="injectables/MailingService.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >MailingService</a>
                                        </li>
                                        <li class="link">
                                            <a href="injectables/PrismaService.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >PrismaService</a>
                                        </li>
                                        <li class="link">
                                            <a href="injectables/RegisterInstructorService.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >RegisterInstructorService</a>
                                        </li>
                                        <li class="link">
                                            <a href="injectables/UploadService.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >UploadService</a>
                                        </li>
                                    </ul>
                                </li>
                            </li>
                            <li class="link">
                                <a href="modules/ReviewModule.html" data-type="entity-link" >ReviewModule</a>
                                    <li class="chapter inner">
                                        <div class="simple menu-toggler" data-bs-toggle="collapse" ${ isNormalMode ?
                                            'data-bs-target="#controllers-links-module-ReviewModule-f1f61613f06c77105ae35e9988abe3c2258b69e7f4eeef3ee0f2f96353e6d22fb3193e54a1952b97eb70c0448c36f4ad75bc315dae1ba986c35b15bd35195adc"' : 'data-bs-target="#xs-controllers-links-module-ReviewModule-f1f61613f06c77105ae35e9988abe3c2258b69e7f4eeef3ee0f2f96353e6d22fb3193e54a1952b97eb70c0448c36f4ad75bc315dae1ba986c35b15bd35195adc"' }>
                                            <span class="icon ion-md-swap"></span>
                                            <span>Controllers</span>
                                            <span class="icon ion-ios-arrow-down"></span>
                                        </div>
                                        <ul class="links collapse" ${ isNormalMode ? 'id="controllers-links-module-ReviewModule-f1f61613f06c77105ae35e9988abe3c2258b69e7f4eeef3ee0f2f96353e6d22fb3193e54a1952b97eb70c0448c36f4ad75bc315dae1ba986c35b15bd35195adc"' :
                                            'id="xs-controllers-links-module-ReviewModule-f1f61613f06c77105ae35e9988abe3c2258b69e7f4eeef3ee0f2f96353e6d22fb3193e54a1952b97eb70c0448c36f4ad75bc315dae1ba986c35b15bd35195adc"' }>
                                            <li class="link">
                                                <a href="controllers/ReplyController.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >ReplyController</a>
                                            </li>
                                            <li class="link">
                                                <a href="controllers/ReviewController.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >ReviewController</a>
                                            </li>
                                        </ul>
                                    </li>
                                <li class="chapter inner">
                                    <div class="simple menu-toggler" data-bs-toggle="collapse" ${ isNormalMode ?
                                        'data-bs-target="#injectables-links-module-ReviewModule-f1f61613f06c77105ae35e9988abe3c2258b69e7f4eeef3ee0f2f96353e6d22fb3193e54a1952b97eb70c0448c36f4ad75bc315dae1ba986c35b15bd35195adc"' : 'data-bs-target="#xs-injectables-links-module-ReviewModule-f1f61613f06c77105ae35e9988abe3c2258b69e7f4eeef3ee0f2f96353e6d22fb3193e54a1952b97eb70c0448c36f4ad75bc315dae1ba986c35b15bd35195adc"' }>
                                        <span class="icon ion-md-arrow-round-down"></span>
                                        <span>Injectables</span>
                                        <span class="icon ion-ios-arrow-down"></span>
                                    </div>
                                    <ul class="links collapse" ${ isNormalMode ? 'id="injectables-links-module-ReviewModule-f1f61613f06c77105ae35e9988abe3c2258b69e7f4eeef3ee0f2f96353e6d22fb3193e54a1952b97eb70c0448c36f4ad75bc315dae1ba986c35b15bd35195adc"' :
                                        'id="xs-injectables-links-module-ReviewModule-f1f61613f06c77105ae35e9988abe3c2258b69e7f4eeef3ee0f2f96353e6d22fb3193e54a1952b97eb70c0448c36f4ad75bc315dae1ba986c35b15bd35195adc"' }>
                                        <li class="link">
                                            <a href="injectables/PrismaService.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >PrismaService</a>
                                        </li>
                                        <li class="link">
                                            <a href="injectables/ReviewService.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >ReviewService</a>
                                        </li>
                                    </ul>
                                </li>
                            </li>
                            <li class="link">
                                <a href="modules/ThreadModule.html" data-type="entity-link" >ThreadModule</a>
                                    <li class="chapter inner">
                                        <div class="simple menu-toggler" data-bs-toggle="collapse" ${ isNormalMode ?
                                            'data-bs-target="#controllers-links-module-ThreadModule-f03fe22e5937f49cca4441a7c03f074f1ca382f2775fb7b618cbcc9345d8f50682a1ef2fc1929e2841cd77e320ec04b667029c04d1f642b5b239dd3c9bab3fd9"' : 'data-bs-target="#xs-controllers-links-module-ThreadModule-f03fe22e5937f49cca4441a7c03f074f1ca382f2775fb7b618cbcc9345d8f50682a1ef2fc1929e2841cd77e320ec04b667029c04d1f642b5b239dd3c9bab3fd9"' }>
                                            <span class="icon ion-md-swap"></span>
                                            <span>Controllers</span>
                                            <span class="icon ion-ios-arrow-down"></span>
                                        </div>
                                        <ul class="links collapse" ${ isNormalMode ? 'id="controllers-links-module-ThreadModule-f03fe22e5937f49cca4441a7c03f074f1ca382f2775fb7b618cbcc9345d8f50682a1ef2fc1929e2841cd77e320ec04b667029c04d1f642b5b239dd3c9bab3fd9"' :
                                            'id="xs-controllers-links-module-ThreadModule-f03fe22e5937f49cca4441a7c03f074f1ca382f2775fb7b618cbcc9345d8f50682a1ef2fc1929e2841cd77e320ec04b667029c04d1f642b5b239dd3c9bab3fd9"' }>
                                            <li class="link">
                                                <a href="controllers/ThreadController.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >ThreadController</a>
                                            </li>
                                        </ul>
                                    </li>
                                <li class="chapter inner">
                                    <div class="simple menu-toggler" data-bs-toggle="collapse" ${ isNormalMode ?
                                        'data-bs-target="#injectables-links-module-ThreadModule-f03fe22e5937f49cca4441a7c03f074f1ca382f2775fb7b618cbcc9345d8f50682a1ef2fc1929e2841cd77e320ec04b667029c04d1f642b5b239dd3c9bab3fd9"' : 'data-bs-target="#xs-injectables-links-module-ThreadModule-f03fe22e5937f49cca4441a7c03f074f1ca382f2775fb7b618cbcc9345d8f50682a1ef2fc1929e2841cd77e320ec04b667029c04d1f642b5b239dd3c9bab3fd9"' }>
                                        <span class="icon ion-md-arrow-round-down"></span>
                                        <span>Injectables</span>
                                        <span class="icon ion-ios-arrow-down"></span>
                                    </div>
                                    <ul class="links collapse" ${ isNormalMode ? 'id="injectables-links-module-ThreadModule-f03fe22e5937f49cca4441a7c03f074f1ca382f2775fb7b618cbcc9345d8f50682a1ef2fc1929e2841cd77e320ec04b667029c04d1f642b5b239dd3c9bab3fd9"' :
                                        'id="xs-injectables-links-module-ThreadModule-f03fe22e5937f49cca4441a7c03f074f1ca382f2775fb7b618cbcc9345d8f50682a1ef2fc1929e2841cd77e320ec04b667029c04d1f642b5b239dd3c9bab3fd9"' }>
                                        <li class="link">
                                            <a href="injectables/PrismaService.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >PrismaService</a>
                                        </li>
                                        <li class="link">
                                            <a href="injectables/ThreadService.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >ThreadService</a>
                                        </li>
                                        <li class="link">
                                            <a href="injectables/UploadService.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >UploadService</a>
                                        </li>
                                    </ul>
                                </li>
                            </li>
                            <li class="link">
                                <a href="modules/UploadModule.html" data-type="entity-link" >UploadModule</a>
                                <li class="chapter inner">
                                    <div class="simple menu-toggler" data-bs-toggle="collapse" ${ isNormalMode ?
                                        'data-bs-target="#injectables-links-module-UploadModule-141f9806e5dd276c1f0f6d3e740b60a03738b0c1e5a63d98067b22f721c7b8e85f819c65d1f8c7236c531709b21db274b57a1cbe325d5e7eaba9762777b5a501"' : 'data-bs-target="#xs-injectables-links-module-UploadModule-141f9806e5dd276c1f0f6d3e740b60a03738b0c1e5a63d98067b22f721c7b8e85f819c65d1f8c7236c531709b21db274b57a1cbe325d5e7eaba9762777b5a501"' }>
                                        <span class="icon ion-md-arrow-round-down"></span>
                                        <span>Injectables</span>
                                        <span class="icon ion-ios-arrow-down"></span>
                                    </div>
                                    <ul class="links collapse" ${ isNormalMode ? 'id="injectables-links-module-UploadModule-141f9806e5dd276c1f0f6d3e740b60a03738b0c1e5a63d98067b22f721c7b8e85f819c65d1f8c7236c531709b21db274b57a1cbe325d5e7eaba9762777b5a501"' :
                                        'id="xs-injectables-links-module-UploadModule-141f9806e5dd276c1f0f6d3e740b60a03738b0c1e5a63d98067b22f721c7b8e85f819c65d1f8c7236c531709b21db274b57a1cbe325d5e7eaba9762777b5a501"' }>
                                        <li class="link">
                                            <a href="injectables/ChatgptService.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >ChatgptService</a>
                                        </li>
                                        <li class="link">
                                            <a href="injectables/PrismaService.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >PrismaService</a>
                                        </li>
                                        <li class="link">
                                            <a href="injectables/QuizzService.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >QuizzService</a>
                                        </li>
                                        <li class="link">
                                            <a href="injectables/UploadService.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >UploadService</a>
                                        </li>
                                    </ul>
                                </li>
                            </li>
                            <li class="link">
                                <a href="modules/UserModule.html" data-type="entity-link" >UserModule</a>
                                    <li class="chapter inner">
                                        <div class="simple menu-toggler" data-bs-toggle="collapse" ${ isNormalMode ?
                                            'data-bs-target="#controllers-links-module-UserModule-e37c9597fb544918edd0b02054b76a94279af84e59689049f0ce144e1e1930dd3b36e4ff37414660b5f894ad167bec4cd6d3b24a14971b33976b8162af9958df"' : 'data-bs-target="#xs-controllers-links-module-UserModule-e37c9597fb544918edd0b02054b76a94279af84e59689049f0ce144e1e1930dd3b36e4ff37414660b5f894ad167bec4cd6d3b24a14971b33976b8162af9958df"' }>
                                            <span class="icon ion-md-swap"></span>
                                            <span>Controllers</span>
                                            <span class="icon ion-ios-arrow-down"></span>
                                        </div>
                                        <ul class="links collapse" ${ isNormalMode ? 'id="controllers-links-module-UserModule-e37c9597fb544918edd0b02054b76a94279af84e59689049f0ce144e1e1930dd3b36e4ff37414660b5f894ad167bec4cd6d3b24a14971b33976b8162af9958df"' :
                                            'id="xs-controllers-links-module-UserModule-e37c9597fb544918edd0b02054b76a94279af84e59689049f0ce144e1e1930dd3b36e4ff37414660b5f894ad167bec4cd6d3b24a14971b33976b8162af9958df"' }>
                                            <li class="link">
                                                <a href="controllers/UserAdminController.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >UserAdminController</a>
                                            </li>
                                            <li class="link">
                                                <a href="controllers/UserController.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >UserController</a>
                                            </li>
                                        </ul>
                                    </li>
                                <li class="chapter inner">
                                    <div class="simple menu-toggler" data-bs-toggle="collapse" ${ isNormalMode ?
                                        'data-bs-target="#injectables-links-module-UserModule-e37c9597fb544918edd0b02054b76a94279af84e59689049f0ce144e1e1930dd3b36e4ff37414660b5f894ad167bec4cd6d3b24a14971b33976b8162af9958df"' : 'data-bs-target="#xs-injectables-links-module-UserModule-e37c9597fb544918edd0b02054b76a94279af84e59689049f0ce144e1e1930dd3b36e4ff37414660b5f894ad167bec4cd6d3b24a14971b33976b8162af9958df"' }>
                                        <span class="icon ion-md-arrow-round-down"></span>
                                        <span>Injectables</span>
                                        <span class="icon ion-ios-arrow-down"></span>
                                    </div>
                                    <ul class="links collapse" ${ isNormalMode ? 'id="injectables-links-module-UserModule-e37c9597fb544918edd0b02054b76a94279af84e59689049f0ce144e1e1930dd3b36e4ff37414660b5f894ad167bec4cd6d3b24a14971b33976b8162af9958df"' :
                                        'id="xs-injectables-links-module-UserModule-e37c9597fb544918edd0b02054b76a94279af84e59689049f0ce144e1e1930dd3b36e4ff37414660b5f894ad167bec4cd6d3b24a14971b33976b8162af9958df"' }>
                                        <li class="link">
                                            <a href="injectables/PrismaService.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >PrismaService</a>
                                        </li>
                                        <li class="link">
                                            <a href="injectables/UploadService.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >UploadService</a>
                                        </li>
                                        <li class="link">
                                            <a href="injectables/UserService.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >UserService</a>
                                        </li>
                                    </ul>
                                </li>
                            </li>
                            <li class="link">
                                <a href="modules/UserProgressModule.html" data-type="entity-link" >UserProgressModule</a>
                                    <li class="chapter inner">
                                        <div class="simple menu-toggler" data-bs-toggle="collapse" ${ isNormalMode ?
                                            'data-bs-target="#controllers-links-module-UserProgressModule-c727ac9692de761827b61d820e715c9c4ebfa79c3de68fae8b5a9af5648cd99f45a47d2c6f17d2f9a44a696a7a8851089780b0a540ac779e91b619b5344c77f0"' : 'data-bs-target="#xs-controllers-links-module-UserProgressModule-c727ac9692de761827b61d820e715c9c4ebfa79c3de68fae8b5a9af5648cd99f45a47d2c6f17d2f9a44a696a7a8851089780b0a540ac779e91b619b5344c77f0"' }>
                                            <span class="icon ion-md-swap"></span>
                                            <span>Controllers</span>
                                            <span class="icon ion-ios-arrow-down"></span>
                                        </div>
                                        <ul class="links collapse" ${ isNormalMode ? 'id="controllers-links-module-UserProgressModule-c727ac9692de761827b61d820e715c9c4ebfa79c3de68fae8b5a9af5648cd99f45a47d2c6f17d2f9a44a696a7a8851089780b0a540ac779e91b619b5344c77f0"' :
                                            'id="xs-controllers-links-module-UserProgressModule-c727ac9692de761827b61d820e715c9c4ebfa79c3de68fae8b5a9af5648cd99f45a47d2c6f17d2f9a44a696a7a8851089780b0a540ac779e91b619b5344c77f0"' }>
                                            <li class="link">
                                                <a href="controllers/UserProgressController.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >UserProgressController</a>
                                            </li>
                                        </ul>
                                    </li>
                                <li class="chapter inner">
                                    <div class="simple menu-toggler" data-bs-toggle="collapse" ${ isNormalMode ?
                                        'data-bs-target="#injectables-links-module-UserProgressModule-c727ac9692de761827b61d820e715c9c4ebfa79c3de68fae8b5a9af5648cd99f45a47d2c6f17d2f9a44a696a7a8851089780b0a540ac779e91b619b5344c77f0"' : 'data-bs-target="#xs-injectables-links-module-UserProgressModule-c727ac9692de761827b61d820e715c9c4ebfa79c3de68fae8b5a9af5648cd99f45a47d2c6f17d2f9a44a696a7a8851089780b0a540ac779e91b619b5344c77f0"' }>
                                        <span class="icon ion-md-arrow-round-down"></span>
                                        <span>Injectables</span>
                                        <span class="icon ion-ios-arrow-down"></span>
                                    </div>
                                    <ul class="links collapse" ${ isNormalMode ? 'id="injectables-links-module-UserProgressModule-c727ac9692de761827b61d820e715c9c4ebfa79c3de68fae8b5a9af5648cd99f45a47d2c6f17d2f9a44a696a7a8851089780b0a540ac779e91b619b5344c77f0"' :
                                        'id="xs-injectables-links-module-UserProgressModule-c727ac9692de761827b61d820e715c9c4ebfa79c3de68fae8b5a9af5648cd99f45a47d2c6f17d2f9a44a696a7a8851089780b0a540ac779e91b619b5344c77f0"' }>
                                        <li class="link">
                                            <a href="injectables/PrismaService.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >PrismaService</a>
                                        </li>
                                        <li class="link">
                                            <a href="injectables/UserProgressService.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >UserProgressService</a>
                                        </li>
                                    </ul>
                                </li>
                            </li>
                </ul>
                </li>
                        <li class="chapter">
                            <div class="simple menu-toggler" data-bs-toggle="collapse" ${ isNormalMode ? 'data-bs-target="#controllers-links"' :
                                'data-bs-target="#xs-controllers-links"' }>
                                <span class="icon ion-md-swap"></span>
                                <span>Controllers</span>
                                <span class="icon ion-ios-arrow-down"></span>
                            </div>
                            <ul class="links collapse " ${ isNormalMode ? 'id="controllers-links"' : 'id="xs-controllers-links"' }>
                                <li class="link">
                                    <a href="controllers/AppController.html" data-type="entity-link" >AppController</a>
                                </li>
                                <li class="link">
                                    <a href="controllers/AttachmentController.html" data-type="entity-link" >AttachmentController</a>
                                </li>
                                <li class="link">
                                    <a href="controllers/AuthController.html" data-type="entity-link" >AuthController</a>
                                </li>
                                <li class="link">
                                    <a href="controllers/ChapterController.html" data-type="entity-link" >ChapterController</a>
                                </li>
                                <li class="link">
                                    <a href="controllers/ChatgptController.html" data-type="entity-link" >ChatgptController</a>
                                </li>
                                <li class="link">
                                    <a href="controllers/CodeController.html" data-type="entity-link" >CodeController</a>
                                </li>
                                <li class="link">
                                    <a href="controllers/CodeControllerUser.html" data-type="entity-link" >CodeControllerUser</a>
                                </li>
                                <li class="link">
                                    <a href="controllers/CourseController.html" data-type="entity-link" >CourseController</a>
                                </li>
                                <li class="link">
                                    <a href="controllers/EvaluateController.html" data-type="entity-link" >EvaluateController</a>
                                </li>
                                <li class="link">
                                    <a href="controllers/EvaluatesController.html" data-type="entity-link" >EvaluatesController</a>
                                </li>
                                <li class="link">
                                    <a href="controllers/ExerciseController.html" data-type="entity-link" >ExerciseController</a>
                                </li>
                                <li class="link">
                                    <a href="controllers/LessonController.html" data-type="entity-link" >LessonController</a>
                                </li>
                                <li class="link">
                                    <a href="controllers/LessonControllerUser.html" data-type="entity-link" >LessonControllerUser</a>
                                </li>
                                <li class="link">
                                    <a href="controllers/MailingController.html" data-type="entity-link" >MailingController</a>
                                </li>
                                <li class="link">
                                    <a href="controllers/MessageController.html" data-type="entity-link" >MessageController</a>
                                </li>
                                <li class="link">
                                    <a href="controllers/QuizzController.html" data-type="entity-link" >QuizzController</a>
                                </li>
                                <li class="link">
                                    <a href="controllers/RegisterInstructorAdminController.html" data-type="entity-link" >RegisterInstructorAdminController</a>
                                </li>
                                <li class="link">
                                    <a href="controllers/RegisterInstructorController.html" data-type="entity-link" >RegisterInstructorController</a>
                                </li>
                                <li class="link">
                                    <a href="controllers/ReplyController.html" data-type="entity-link" >ReplyController</a>
                                </li>
                                <li class="link">
                                    <a href="controllers/ReviewController.html" data-type="entity-link" >ReviewController</a>
                                </li>
                                <li class="link">
                                    <a href="controllers/ThreadController.html" data-type="entity-link" >ThreadController</a>
                                </li>
                                <li class="link">
                                    <a href="controllers/UserAdminController.html" data-type="entity-link" >UserAdminController</a>
                                </li>
                                <li class="link">
                                    <a href="controllers/UserController.html" data-type="entity-link" >UserController</a>
                                </li>
                                <li class="link">
                                    <a href="controllers/UserProgressController.html" data-type="entity-link" >UserProgressController</a>
                                </li>
                            </ul>
                        </li>
                    <li class="chapter">
                        <div class="simple menu-toggler" data-bs-toggle="collapse" ${ isNormalMode ? 'data-bs-target="#classes-links"' :
                            'data-bs-target="#xs-classes-links"' }>
                            <span class="icon ion-ios-paper"></span>
                            <span>Classes</span>
                            <span class="icon ion-ios-arrow-down"></span>
                        </div>
                        <ul class="links collapse " ${ isNormalMode ? 'id="classes-links"' : 'id="xs-classes-links"' }>
                            <li class="link">
                                <a href="classes/AccessChannelGeneralDto.html" data-type="entity-link" >AccessChannelGeneralDto</a>
                            </li>
                            <li class="link">
                                <a href="classes/AddAnswerUserProgressDto.html" data-type="entity-link" >AddAnswerUserProgressDto</a>
                            </li>
                            <li class="link">
                                <a href="classes/AddExerciseLessonDto.html" data-type="entity-link" >AddExerciseLessonDto</a>
                            </li>
                            <li class="link">
                                <a href="classes/AddFileNameDto.html" data-type="entity-link" >AddFileNameDto</a>
                            </li>
                            <li class="link">
                                <a href="classes/AddFileTestDto.html" data-type="entity-link" >AddFileTestDto</a>
                            </li>
                            <li class="link">
                                <a href="classes/AddQuestionCodeDto.html" data-type="entity-link" >AddQuestionCodeDto</a>
                            </li>
                            <li class="link">
                                <a href="classes/AddRegisterInstructorDto.html" data-type="entity-link" >AddRegisterInstructorDto</a>
                            </li>
                            <li class="link">
                                <a href="classes/AddReplyDto.html" data-type="entity-link" >AddReplyDto</a>
                            </li>
                            <li class="link">
                                <a href="classes/AddReviewDto.html" data-type="entity-link" >AddReviewDto</a>
                            </li>
                            <li class="link">
                                <a href="classes/AddSubtitleLessonDto.html" data-type="entity-link" >AddSubtitleLessonDto</a>
                            </li>
                            <li class="link">
                                <a href="classes/AddUserProgressDto.html" data-type="entity-link" >AddUserProgressDto</a>
                            </li>
                            <li class="link">
                                <a href="classes/AllReviewCourseDto.html" data-type="entity-link" >AllReviewCourseDto</a>
                            </li>
                            <li class="link">
                                <a href="classes/ChatbotUserDto.html" data-type="entity-link" >ChatbotUserDto</a>
                            </li>
                            <li class="link">
                                <a href="classes/CheckInviteCodeDto.html" data-type="entity-link" >CheckInviteCodeDto</a>
                            </li>
                            <li class="link">
                                <a href="classes/CompleteLessonDto.html" data-type="entity-link" >CompleteLessonDto</a>
                            </li>
                            <li class="link">
                                <a href="classes/ContentLessonDto.html" data-type="entity-link" >ContentLessonDto</a>
                            </li>
                            <li class="link">
                                <a href="classes/CreateAttachmentDto.html" data-type="entity-link" >CreateAttachmentDto</a>
                            </li>
                            <li class="link">
                                <a href="classes/CreateChannelDto.html" data-type="entity-link" >CreateChannelDto</a>
                            </li>
                            <li class="link">
                                <a href="classes/CreateChapterDto.html" data-type="entity-link" >CreateChapterDto</a>
                            </li>
                            <li class="link">
                                <a href="classes/CreateConversationDto.html" data-type="entity-link" >CreateConversationDto</a>
                            </li>
                            <li class="link">
                                <a href="classes/CreateCourseDto.html" data-type="entity-link" >CreateCourseDto</a>
                            </li>
                            <li class="link">
                                <a href="classes/CreateDirectMessageDto.html" data-type="entity-link" >CreateDirectMessageDto</a>
                            </li>
                            <li class="link">
                                <a href="classes/CreateExerciseDto.html" data-type="entity-link" >CreateExerciseDto</a>
                            </li>
                            <li class="link">
                                <a href="classes/CreateLessonDto.html" data-type="entity-link" >CreateLessonDto</a>
                            </li>
                            <li class="link">
                                <a href="classes/CreateListQuizzDto.html" data-type="entity-link" >CreateListQuizzDto</a>
                            </li>
                            <li class="link">
                                <a href="classes/CreateMediaRoomDto.html" data-type="entity-link" >CreateMediaRoomDto</a>
                            </li>
                            <li class="link">
                                <a href="classes/createMessageChannelDto.html" data-type="entity-link" >createMessageChannelDto</a>
                            </li>
                            <li class="link">
                                <a href="classes/CreateQuizzDto.html" data-type="entity-link" >CreateQuizzDto</a>
                            </li>
                            <li class="link">
                                <a href="classes/CreateServerDto.html" data-type="entity-link" >CreateServerDto</a>
                            </li>
                            <li class="link">
                                <a href="classes/CreateTopicDto.html" data-type="entity-link" >CreateTopicDto</a>
                            </li>
                            <li class="link">
                                <a href="classes/DeleteAttachmentDto.html" data-type="entity-link" >DeleteAttachmentDto</a>
                            </li>
                            <li class="link">
                                <a href="classes/DeleteChannelDto.html" data-type="entity-link" >DeleteChannelDto</a>
                            </li>
                            <li class="link">
                                <a href="classes/DeleteChapterDto.html" data-type="entity-link" >DeleteChapterDto</a>
                            </li>
                            <li class="link">
                                <a href="classes/DeleteCourseDto.html" data-type="entity-link" >DeleteCourseDto</a>
                            </li>
                            <li class="link">
                                <a href="classes/DeleteFileDto.html" data-type="entity-link" >DeleteFileDto</a>
                            </li>
                            <li class="link">
                                <a href="classes/DeleteLessonDto.html" data-type="entity-link" >DeleteLessonDto</a>
                            </li>
                            <li class="link">
                                <a href="classes/DeleteMessageChannelDto.html" data-type="entity-link" >DeleteMessageChannelDto</a>
                            </li>
                            <li class="link">
                                <a href="classes/DeleteMessageConversationDto.html" data-type="entity-link" >DeleteMessageConversationDto</a>
                            </li>
                            <li class="link">
                                <a href="classes/DeleteReplyDto.html" data-type="entity-link" >DeleteReplyDto</a>
                            </li>
                            <li class="link">
                                <a href="classes/DeleteReviewDto.html" data-type="entity-link" >DeleteReviewDto</a>
                            </li>
                            <li class="link">
                                <a href="classes/DeleteSubtitleLessonDto.html" data-type="entity-link" >DeleteSubtitleLessonDto</a>
                            </li>
                            <li class="link">
                                <a href="classes/DetailChannelDto.html" data-type="entity-link" >DetailChannelDto</a>
                            </li>
                            <li class="link">
                                <a href="classes/DetailQuizzDto.html" data-type="entity-link" >DetailQuizzDto</a>
                            </li>
                            <li class="link">
                                <a href="classes/DetailRegisterInstructorDto.html" data-type="entity-link" >DetailRegisterInstructorDto</a>
                            </li>
                            <li class="link">
                                <a href="classes/EditChannelDto.html" data-type="entity-link" >EditChannelDto</a>
                            </li>
                            <li class="link">
                                <a href="classes/EditMessageChannelDto.html" data-type="entity-link" >EditMessageChannelDto</a>
                            </li>
                            <li class="link">
                                <a href="classes/EditMessageConversationDto.html" data-type="entity-link" >EditMessageConversationDto</a>
                            </li>
                            <li class="link">
                                <a href="classes/EmailProcessor.html" data-type="entity-link" >EmailProcessor</a>
                            </li>
                            <li class="link">
                                <a href="classes/FindChapterDto.html" data-type="entity-link" >FindChapterDto</a>
                            </li>
                            <li class="link">
                                <a href="classes/FindCourseByAi.html" data-type="entity-link" >FindCourseByAi</a>
                            </li>
                            <li class="link">
                                <a href="classes/GenerateInviteCodeDto.html" data-type="entity-link" >GenerateInviteCodeDto</a>
                            </li>
                            <li class="link">
                                <a href="classes/GetAllExerciseDto.html" data-type="entity-link" >GetAllExerciseDto</a>
                            </li>
                            <li class="link">
                                <a href="classes/GetAllLanguageCodeDto.html" data-type="entity-link" >GetAllLanguageCodeDto</a>
                            </li>
                            <li class="link">
                                <a href="classes/GetChannelServerDto.html" data-type="entity-link" >GetChannelServerDto</a>
                            </li>
                            <li class="link">
                                <a href="classes/GetCourseBySlugDto.html" data-type="entity-link" >GetCourseBySlugDto</a>
                            </li>
                            <li class="link">
                                <a href="classes/GetCourseUserDto.html" data-type="entity-link" >GetCourseUserDto</a>
                            </li>
                            <li class="link">
                                <a href="classes/GetDetailCodeDto.html" data-type="entity-link" >GetDetailCodeDto</a>
                            </li>
                            <li class="link">
                                <a href="classes/GetDetailCourseDto.html" data-type="entity-link" >GetDetailCourseDto</a>
                            </li>
                            <li class="link">
                                <a href="classes/GetDetailExerciseDto.html" data-type="entity-link" >GetDetailExerciseDto</a>
                            </li>
                            <li class="link">
                                <a href="classes/GetLessonDto.html" data-type="entity-link" >GetLessonDto</a>
                            </li>
                            <li class="link">
                                <a href="classes/GetProgressCourseDto.html" data-type="entity-link" >GetProgressCourseDto</a>
                            </li>
                            <li class="link">
                                <a href="classes/GetServerDto.html" data-type="entity-link" >GetServerDto</a>
                            </li>
                            <li class="link">
                                <a href="classes/KickMemberDto.html" data-type="entity-link" >KickMemberDto</a>
                            </li>
                            <li class="link">
                                <a href="classes/LeaveServerDto.html" data-type="entity-link" >LeaveServerDto</a>
                            </li>
                            <li class="link">
                                <a href="classes/LoginAdminDto.html" data-type="entity-link" >LoginAdminDto</a>
                            </li>
                            <li class="link">
                                <a href="classes/LoginSocialDto.html" data-type="entity-link" >LoginSocialDto</a>
                            </li>
                            <li class="link">
                                <a href="classes/LoginUserDto.html" data-type="entity-link" >LoginUserDto</a>
                            </li>
                            <li class="link">
                                <a href="classes/MessageGateway.html" data-type="entity-link" >MessageGateway</a>
                            </li>
                            <li class="link">
                                <a href="classes/NewUserDto.html" data-type="entity-link" >NewUserDto</a>
                            </li>
                            <li class="link">
                                <a href="classes/PaginationMessageConversationDto.html" data-type="entity-link" >PaginationMessageConversationDto</a>
                            </li>
                            <li class="link">
                                <a href="classes/PaginationMessageDto.html" data-type="entity-link" >PaginationMessageDto</a>
                            </li>
                            <li class="link">
                                <a href="classes/PreviewCodeDto.html" data-type="entity-link" >PreviewCodeDto</a>
                            </li>
                            <li class="link">
                                <a href="classes/Profile.html" data-type="entity-link" >Profile</a>
                            </li>
                            <li class="link">
                                <a href="classes/ReorderChapterDto.html" data-type="entity-link" >ReorderChapterDto</a>
                            </li>
                            <li class="link">
                                <a href="classes/ReorderLessonDto.html" data-type="entity-link" >ReorderLessonDto</a>
                            </li>
                            <li class="link">
                                <a href="classes/ReorderQuizzDto.html" data-type="entity-link" >ReorderQuizzDto</a>
                            </li>
                            <li class="link">
                                <a href="classes/ResetPasswordDto.html" data-type="entity-link" >ResetPasswordDto</a>
                            </li>
                            <li class="link">
                                <a href="classes/RetakeQuizDto.html" data-type="entity-link" >RetakeQuizDto</a>
                            </li>
                            <li class="link">
                                <a href="classes/SetPasswordDto.html" data-type="entity-link" >SetPasswordDto</a>
                            </li>
                            <li class="link">
                                <a href="classes/SocketIOAdapter.html" data-type="entity-link" >SocketIOAdapter</a>
                            </li>
                            <li class="link">
                                <a href="classes/SubmitCodeDto.html" data-type="entity-link" >SubmitCodeDto</a>
                            </li>
                            <li class="link">
                                <a href="classes/SummarizationVideoDto.html" data-type="entity-link" >SummarizationVideoDto</a>
                            </li>
                            <li class="link">
                                <a href="classes/SummaryCourseDto.html" data-type="entity-link" >SummaryCourseDto</a>
                            </li>
                            <li class="link">
                                <a href="classes/SupportCodeDto.html" data-type="entity-link" >SupportCodeDto</a>
                            </li>
                            <li class="link">
                                <a href="classes/TranslateSubtitleDto.html" data-type="entity-link" >TranslateSubtitleDto</a>
                            </li>
                            <li class="link">
                                <a href="classes/UpdateAvatarRequestDto.html" data-type="entity-link" >UpdateAvatarRequestDto</a>
                            </li>
                            <li class="link">
                                <a href="classes/UpdateContentFileDto.html" data-type="entity-link" >UpdateContentFileDto</a>
                            </li>
                            <li class="link">
                                <a href="classes/UpdateExerciseDto.html" data-type="entity-link" >UpdateExerciseDto</a>
                            </li>
                            <li class="link">
                                <a href="classes/UpdateLessonDto.html" data-type="entity-link" >UpdateLessonDto</a>
                            </li>
                            <li class="link">
                                <a href="classes/UpdatePasswordDto.html" data-type="entity-link" >UpdatePasswordDto</a>
                            </li>
                            <li class="link">
                                <a href="classes/UpdatePasswordDto-1.html" data-type="entity-link" >UpdatePasswordDto</a>
                            </li>
                            <li class="link">
                                <a href="classes/UpdateProfile.html" data-type="entity-link" >UpdateProfile</a>
                            </li>
                            <li class="link">
                                <a href="classes/UpdateQuizzDto.html" data-type="entity-link" >UpdateQuizzDto</a>
                            </li>
                            <li class="link">
                                <a href="classes/UpdateRoleDto.html" data-type="entity-link" >UpdateRoleDto</a>
                            </li>
                            <li class="link">
                                <a href="classes/UpdateRoleMemberDto.html" data-type="entity-link" >UpdateRoleMemberDto</a>
                            </li>
                            <li class="link">
                                <a href="classes/UpdateRoleUserSuccess.html" data-type="entity-link" >UpdateRoleUserSuccess</a>
                            </li>
                            <li class="link">
                                <a href="classes/UpdateServerDto.html" data-type="entity-link" >UpdateServerDto</a>
                            </li>
                            <li class="link">
                                <a href="classes/UpdateStatusChapterDto.html" data-type="entity-link" >UpdateStatusChapterDto</a>
                            </li>
                            <li class="link">
                                <a href="classes/UpdateStatusDto.html" data-type="entity-link" >UpdateStatusDto</a>
                            </li>
                            <li class="link">
                                <a href="classes/UpdateStatusExerciseDto.html" data-type="entity-link" >UpdateStatusExerciseDto</a>
                            </li>
                            <li class="link">
                                <a href="classes/UpdateStatusLessonDto.html" data-type="entity-link" >UpdateStatusLessonDto</a>
                            </li>
                            <li class="link">
                                <a href="classes/UpdateStatusQuizzDto.html" data-type="entity-link" >UpdateStatusQuizzDto</a>
                            </li>
                            <li class="link">
                                <a href="classes/UpdateStatusRegisterInstructorDto.html" data-type="entity-link" >UpdateStatusRegisterInstructorDto</a>
                            </li>
                            <li class="link">
                                <a href="classes/UpdateValueChapterDto.html" data-type="entity-link" >UpdateValueChapterDto</a>
                            </li>
                            <li class="link">
                                <a href="classes/UpdateValueCodeDto.html" data-type="entity-link" >UpdateValueCodeDto</a>
                            </li>
                            <li class="link">
                                <a href="classes/UpdateValueCourse.html" data-type="entity-link" >UpdateValueCourse</a>
                            </li>
                            <li class="link">
                                <a href="classes/UploadFileChannelDto.html" data-type="entity-link" >UploadFileChannelDto</a>
                            </li>
                            <li class="link">
                                <a href="classes/UploadFileConversationDto.html" data-type="entity-link" >UploadFileConversationDto</a>
                            </li>
                            <li class="link">
                                <a href="classes/UploadProcessor.html" data-type="entity-link" >UploadProcessor</a>
                            </li>
                            <li class="link">
                                <a href="classes/UploadVideoDto.html" data-type="entity-link" >UploadVideoDto</a>
                            </li>
                            <li class="link">
                                <a href="classes/UserRegister.html" data-type="entity-link" >UserRegister</a>
                            </li>
                            <li class="link">
                                <a href="classes/UserResetPassword.html" data-type="entity-link" >UserResetPassword</a>
                            </li>
                            <li class="link">
                                <a href="classes/VerifyResetPasswordDto.html" data-type="entity-link" >VerifyResetPasswordDto</a>
                            </li>
                        </ul>
                    </li>
                        <li class="chapter">
                            <div class="simple menu-toggler" data-bs-toggle="collapse" ${ isNormalMode ? 'data-bs-target="#injectables-links"' :
                                'data-bs-target="#xs-injectables-links"' }>
                                <span class="icon ion-md-arrow-round-down"></span>
                                <span>Injectables</span>
                                <span class="icon ion-ios-arrow-down"></span>
                            </div>
                            <ul class="links collapse " ${ isNormalMode ? 'id="injectables-links"' : 'id="xs-injectables-links"' }>
                                <li class="link">
                                    <a href="injectables/AppService.html" data-type="entity-link" >AppService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/AttachmentService.html" data-type="entity-link" >AttachmentService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/AuthService.html" data-type="entity-link" >AuthService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/ChapterService.html" data-type="entity-link" >ChapterService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/ChatgptService.html" data-type="entity-link" >ChatgptService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/CodeService.html" data-type="entity-link" >CodeService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/CourseService.html" data-type="entity-link" >CourseService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/EvaluateService.html" data-type="entity-link" >EvaluateService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/ExerciseService.html" data-type="entity-link" >ExerciseService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/FileTypeValidationPipe.html" data-type="entity-link" >FileTypeValidationPipe</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/LessonService.html" data-type="entity-link" >LessonService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/MailingService.html" data-type="entity-link" >MailingService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/MessageService.html" data-type="entity-link" >MessageService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/PrismaService.html" data-type="entity-link" >PrismaService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/QuizzService.html" data-type="entity-link" >QuizzService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/RegisterInstructorService.html" data-type="entity-link" >RegisterInstructorService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/ReviewService.html" data-type="entity-link" >ReviewService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/ThreadService.html" data-type="entity-link" >ThreadService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/UploadService.html" data-type="entity-link" >UploadService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/UserProgressService.html" data-type="entity-link" >UserProgressService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/UserService.html" data-type="entity-link" >UserService</a>
                                </li>
                            </ul>
                        </li>
                    <li class="chapter">
                        <div class="simple menu-toggler" data-bs-toggle="collapse" ${ isNormalMode ? 'data-bs-target="#guards-links"' :
                            'data-bs-target="#xs-guards-links"' }>
                            <span class="icon ion-ios-lock"></span>
                            <span>Guards</span>
                            <span class="icon ion-ios-arrow-down"></span>
                        </div>
                        <ul class="links collapse " ${ isNormalMode ? 'id="guards-links"' : 'id="xs-guards-links"' }>
                            <li class="link">
                                <a href="guards/JwtGuard.html" data-type="entity-link" >JwtGuard</a>
                            </li>
                            <li class="link">
                                <a href="guards/RefreshJwtGuard.html" data-type="entity-link" >RefreshJwtGuard</a>
                            </li>
                            <li class="link">
                                <a href="guards/RolesGuard.html" data-type="entity-link" >RolesGuard</a>
                            </li>
                        </ul>
                    </li>
                    <li class="chapter">
                        <div class="simple menu-toggler" data-bs-toggle="collapse" ${ isNormalMode ? 'data-bs-target="#interfaces-links"' :
                            'data-bs-target="#xs-interfaces-links"' }>
                            <span class="icon ion-md-information-circle-outline"></span>
                            <span>Interfaces</span>
                            <span class="icon ion-ios-arrow-down"></span>
                        </div>
                        <ul class="links collapse " ${ isNormalMode ? ' id="interfaces-links"' : 'id="xs-interfaces-links"' }>
                            <li class="link">
                                <a href="interfaces/AddSubtitleLessonInterface.html" data-type="entity-link" >AddSubtitleLessonInterface</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/AttachmentServiceInterface.html" data-type="entity-link" >AttachmentServiceInterface</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/AuthServiceInterface.html" data-type="entity-link" >AuthServiceInterface</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/ChannelResponse.html" data-type="entity-link" >ChannelResponse</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/ChapterResponse.html" data-type="entity-link" >ChapterResponse</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/ChapterServiceInterface.html" data-type="entity-link" >ChapterServiceInterface</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/ChatgptServiceInterface.html" data-type="entity-link" >ChatgptServiceInterface</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/CodeServiceInterface.html" data-type="entity-link" >CodeServiceInterface</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/CourseResponse.html" data-type="entity-link" >CourseResponse</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/CourseServiceInterface.html" data-type="entity-link" >CourseServiceInterface</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/CreateServerInterface.html" data-type="entity-link" >CreateServerInterface</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/DetailCodeInterface.html" data-type="entity-link" >DetailCodeInterface</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/EvaluateCode.html" data-type="entity-link" >EvaluateCode</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/EvaluateServiceInterface.html" data-type="entity-link" >EvaluateServiceInterface</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/ExerciseResponse.html" data-type="entity-link" >ExerciseResponse</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/ExerciseServiceInterface.html" data-type="entity-link" >ExerciseServiceInterface</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/FilterCourseDto.html" data-type="entity-link" >FilterCourseDto</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/HistoryInterface.html" data-type="entity-link" >HistoryInterface</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/LessonResponse.html" data-type="entity-link" >LessonResponse</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/LessonServiceInterface.html" data-type="entity-link" >LessonServiceInterface</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/MailingServiceInterface.html" data-type="entity-link" >MailingServiceInterface</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/MessageServiceInterface.html" data-type="entity-link" >MessageServiceInterface</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/ModerateVideoInterface.html" data-type="entity-link" >ModerateVideoInterface</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/OutputFormat.html" data-type="entity-link" >OutputFormat</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/OutputFormatMC.html" data-type="entity-link" >OutputFormatMC</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/OutputFormatTF.html" data-type="entity-link" >OutputFormatTF</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/ProfileResponse.html" data-type="entity-link" >ProfileResponse</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/QueueUploadVideo.html" data-type="entity-link" >QueueUploadVideo</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/QuizzResponse.html" data-type="entity-link" >QuizzResponse</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/QuizzServiceInterface.html" data-type="entity-link" >QuizzServiceInterface</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/RegisterInstructorInterface.html" data-type="entity-link" >RegisterInstructorInterface</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/RegisterInstructorServiceInterface.html" data-type="entity-link" >RegisterInstructorServiceInterface</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/ReviewServiceInterface.html" data-type="entity-link" >ReviewServiceInterface</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/ServerResponse.html" data-type="entity-link" >ServerResponse</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/ThreadServiceInterface.html" data-type="entity-link" >ThreadServiceInterface</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/TranslateSubtitleQueue.html" data-type="entity-link" >TranslateSubtitleQueue</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/UpdateAvatarDto.html" data-type="entity-link" >UpdateAvatarDto</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/UpdatePictureCourse.html" data-type="entity-link" >UpdatePictureCourse</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/UpdateServerInterface.html" data-type="entity-link" >UpdateServerInterface</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/UpdateThumbnailVideo.html" data-type="entity-link" >UpdateThumbnailVideo</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/UpdateVideoLesson.html" data-type="entity-link" >UpdateVideoLesson</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/UploadFileChannelInterface.html" data-type="entity-link" >UploadFileChannelInterface</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/UploadFileConversationInterface.html" data-type="entity-link" >UploadFileConversationInterface</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/UploadFileDto.html" data-type="entity-link" >UploadFileDto</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/UploadServiceInterface.html" data-type="entity-link" >UploadServiceInterface</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/UserAccessDto.html" data-type="entity-link" >UserAccessDto</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/UserProgressServiceInterface.html" data-type="entity-link" >UserProgressServiceInterface</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/UserResponse.html" data-type="entity-link" >UserResponse</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/UserServiceInterface.html" data-type="entity-link" >UserServiceInterface</a>
                            </li>
                        </ul>
                    </li>
                    <li class="chapter">
                        <div class="simple menu-toggler" data-bs-toggle="collapse" ${ isNormalMode ? 'data-bs-target="#miscellaneous-links"'
                            : 'data-bs-target="#xs-miscellaneous-links"' }>
                            <span class="icon ion-ios-cube"></span>
                            <span>Miscellaneous</span>
                            <span class="icon ion-ios-arrow-down"></span>
                        </div>
                        <ul class="links collapse " ${ isNormalMode ? 'id="miscellaneous-links"' : 'id="xs-miscellaneous-links"' }>
                            <li class="link">
                                <a href="miscellaneous/functions.html" data-type="entity-link">Functions</a>
                            </li>
                            <li class="link">
                                <a href="miscellaneous/typealiases.html" data-type="entity-link">Type aliases</a>
                            </li>
                            <li class="link">
                                <a href="miscellaneous/variables.html" data-type="entity-link">Variables</a>
                            </li>
                        </ul>
                    </li>
                    <li class="chapter">
                        <a data-type="chapter-link" href="coverage.html"><span class="icon ion-ios-stats"></span>Documentation coverage</a>
                    </li>
                    <li class="divider"></li>
                    <li class="copyright">
                        Documentation generated using <a href="https://compodoc.app/" target="_blank" rel="noopener noreferrer">
                            <img data-src="images/compodoc-vectorise.png" class="img-responsive" data-type="compodoc-logo">
                        </a>
                    </li>
            </ul>
        </nav>
        `);
        this.innerHTML = tp.strings;
    }
});