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
                                            'data-bs-target="#controllers-links-module-AppModule-47658c06c4d16ffe93ff6c99c27f7d22d0f347766d09dc6957d83425932f35d7e319883cbb5b7fc322e2d9b19a1c4865a3ea9bfc7233c2962a56db6cd365e323"' : 'data-bs-target="#xs-controllers-links-module-AppModule-47658c06c4d16ffe93ff6c99c27f7d22d0f347766d09dc6957d83425932f35d7e319883cbb5b7fc322e2d9b19a1c4865a3ea9bfc7233c2962a56db6cd365e323"' }>
                                            <span class="icon ion-md-swap"></span>
                                            <span>Controllers</span>
                                            <span class="icon ion-ios-arrow-down"></span>
                                        </div>
                                        <ul class="links collapse" ${ isNormalMode ? 'id="controllers-links-module-AppModule-47658c06c4d16ffe93ff6c99c27f7d22d0f347766d09dc6957d83425932f35d7e319883cbb5b7fc322e2d9b19a1c4865a3ea9bfc7233c2962a56db6cd365e323"' :
                                            'id="xs-controllers-links-module-AppModule-47658c06c4d16ffe93ff6c99c27f7d22d0f347766d09dc6957d83425932f35d7e319883cbb5b7fc322e2d9b19a1c4865a3ea9bfc7233c2962a56db6cd365e323"' }>
                                            <li class="link">
                                                <a href="controllers/AppController.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >AppController</a>
                                            </li>
                                        </ul>
                                    </li>
                                <li class="chapter inner">
                                    <div class="simple menu-toggler" data-bs-toggle="collapse" ${ isNormalMode ?
                                        'data-bs-target="#injectables-links-module-AppModule-47658c06c4d16ffe93ff6c99c27f7d22d0f347766d09dc6957d83425932f35d7e319883cbb5b7fc322e2d9b19a1c4865a3ea9bfc7233c2962a56db6cd365e323"' : 'data-bs-target="#xs-injectables-links-module-AppModule-47658c06c4d16ffe93ff6c99c27f7d22d0f347766d09dc6957d83425932f35d7e319883cbb5b7fc322e2d9b19a1c4865a3ea9bfc7233c2962a56db6cd365e323"' }>
                                        <span class="icon ion-md-arrow-round-down"></span>
                                        <span>Injectables</span>
                                        <span class="icon ion-ios-arrow-down"></span>
                                    </div>
                                    <ul class="links collapse" ${ isNormalMode ? 'id="injectables-links-module-AppModule-47658c06c4d16ffe93ff6c99c27f7d22d0f347766d09dc6957d83425932f35d7e319883cbb5b7fc322e2d9b19a1c4865a3ea9bfc7233c2962a56db6cd365e323"' :
                                        'id="xs-injectables-links-module-AppModule-47658c06c4d16ffe93ff6c99c27f7d22d0f347766d09dc6957d83425932f35d7e319883cbb5b7fc322e2d9b19a1c4865a3ea9bfc7233c2962a56db6cd365e323"' }>
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
                                            'data-bs-target="#controllers-links-module-AttachmentModule-cfbfb51334fc1eac569d6b2ae831b55db288eb52b629bce25db07cc67ef49932380210a6c927ce9612129a4ec572974eca6698b1a54f043448cf768f4e83130a"' : 'data-bs-target="#xs-controllers-links-module-AttachmentModule-cfbfb51334fc1eac569d6b2ae831b55db288eb52b629bce25db07cc67ef49932380210a6c927ce9612129a4ec572974eca6698b1a54f043448cf768f4e83130a"' }>
                                            <span class="icon ion-md-swap"></span>
                                            <span>Controllers</span>
                                            <span class="icon ion-ios-arrow-down"></span>
                                        </div>
                                        <ul class="links collapse" ${ isNormalMode ? 'id="controllers-links-module-AttachmentModule-cfbfb51334fc1eac569d6b2ae831b55db288eb52b629bce25db07cc67ef49932380210a6c927ce9612129a4ec572974eca6698b1a54f043448cf768f4e83130a"' :
                                            'id="xs-controllers-links-module-AttachmentModule-cfbfb51334fc1eac569d6b2ae831b55db288eb52b629bce25db07cc67ef49932380210a6c927ce9612129a4ec572974eca6698b1a54f043448cf768f4e83130a"' }>
                                            <li class="link">
                                                <a href="controllers/AttachmentController.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >AttachmentController</a>
                                            </li>
                                        </ul>
                                    </li>
                                <li class="chapter inner">
                                    <div class="simple menu-toggler" data-bs-toggle="collapse" ${ isNormalMode ?
                                        'data-bs-target="#injectables-links-module-AttachmentModule-cfbfb51334fc1eac569d6b2ae831b55db288eb52b629bce25db07cc67ef49932380210a6c927ce9612129a4ec572974eca6698b1a54f043448cf768f4e83130a"' : 'data-bs-target="#xs-injectables-links-module-AttachmentModule-cfbfb51334fc1eac569d6b2ae831b55db288eb52b629bce25db07cc67ef49932380210a6c927ce9612129a4ec572974eca6698b1a54f043448cf768f4e83130a"' }>
                                        <span class="icon ion-md-arrow-round-down"></span>
                                        <span>Injectables</span>
                                        <span class="icon ion-ios-arrow-down"></span>
                                    </div>
                                    <ul class="links collapse" ${ isNormalMode ? 'id="injectables-links-module-AttachmentModule-cfbfb51334fc1eac569d6b2ae831b55db288eb52b629bce25db07cc67ef49932380210a6c927ce9612129a4ec572974eca6698b1a54f043448cf768f4e83130a"' :
                                        'id="xs-injectables-links-module-AttachmentModule-cfbfb51334fc1eac569d6b2ae831b55db288eb52b629bce25db07cc67ef49932380210a6c927ce9612129a4ec572974eca6698b1a54f043448cf768f4e83130a"' }>
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
                                            'data-bs-target="#controllers-links-module-ChatgptModule-35a1b4ee512ff12794c11ac3b481d981ed4f5c4b9cc3871a8b2a7c32aeb4dfd954a92d7e13c3108bc0802ed612f000d65bfb624504e1af9b36dd5d44bb62e2b5"' : 'data-bs-target="#xs-controllers-links-module-ChatgptModule-35a1b4ee512ff12794c11ac3b481d981ed4f5c4b9cc3871a8b2a7c32aeb4dfd954a92d7e13c3108bc0802ed612f000d65bfb624504e1af9b36dd5d44bb62e2b5"' }>
                                            <span class="icon ion-md-swap"></span>
                                            <span>Controllers</span>
                                            <span class="icon ion-ios-arrow-down"></span>
                                        </div>
                                        <ul class="links collapse" ${ isNormalMode ? 'id="controllers-links-module-ChatgptModule-35a1b4ee512ff12794c11ac3b481d981ed4f5c4b9cc3871a8b2a7c32aeb4dfd954a92d7e13c3108bc0802ed612f000d65bfb624504e1af9b36dd5d44bb62e2b5"' :
                                            'id="xs-controllers-links-module-ChatgptModule-35a1b4ee512ff12794c11ac3b481d981ed4f5c4b9cc3871a8b2a7c32aeb4dfd954a92d7e13c3108bc0802ed612f000d65bfb624504e1af9b36dd5d44bb62e2b5"' }>
                                            <li class="link">
                                                <a href="controllers/ChatgptController.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >ChatgptController</a>
                                            </li>
                                        </ul>
                                    </li>
                                <li class="chapter inner">
                                    <div class="simple menu-toggler" data-bs-toggle="collapse" ${ isNormalMode ?
                                        'data-bs-target="#injectables-links-module-ChatgptModule-35a1b4ee512ff12794c11ac3b481d981ed4f5c4b9cc3871a8b2a7c32aeb4dfd954a92d7e13c3108bc0802ed612f000d65bfb624504e1af9b36dd5d44bb62e2b5"' : 'data-bs-target="#xs-injectables-links-module-ChatgptModule-35a1b4ee512ff12794c11ac3b481d981ed4f5c4b9cc3871a8b2a7c32aeb4dfd954a92d7e13c3108bc0802ed612f000d65bfb624504e1af9b36dd5d44bb62e2b5"' }>
                                        <span class="icon ion-md-arrow-round-down"></span>
                                        <span>Injectables</span>
                                        <span class="icon ion-ios-arrow-down"></span>
                                    </div>
                                    <ul class="links collapse" ${ isNormalMode ? 'id="injectables-links-module-ChatgptModule-35a1b4ee512ff12794c11ac3b481d981ed4f5c4b9cc3871a8b2a7c32aeb4dfd954a92d7e13c3108bc0802ed612f000d65bfb624504e1af9b36dd5d44bb62e2b5"' :
                                        'id="xs-injectables-links-module-ChatgptModule-35a1b4ee512ff12794c11ac3b481d981ed4f5c4b9cc3871a8b2a7c32aeb4dfd954a92d7e13c3108bc0802ed612f000d65bfb624504e1af9b36dd5d44bb62e2b5"' }>
                                        <li class="link">
                                            <a href="injectables/ChatgptService.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >ChatgptService</a>
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
                                            'data-bs-target="#controllers-links-module-CourseModule-7890376aed4053a2e3d941bea917afebbae521f1f33c680279f6172424e249b050a696f9283235210d30d19c4959d3139219979d57f8a01611ac9368a8dff9f7"' : 'data-bs-target="#xs-controllers-links-module-CourseModule-7890376aed4053a2e3d941bea917afebbae521f1f33c680279f6172424e249b050a696f9283235210d30d19c4959d3139219979d57f8a01611ac9368a8dff9f7"' }>
                                            <span class="icon ion-md-swap"></span>
                                            <span>Controllers</span>
                                            <span class="icon ion-ios-arrow-down"></span>
                                        </div>
                                        <ul class="links collapse" ${ isNormalMode ? 'id="controllers-links-module-CourseModule-7890376aed4053a2e3d941bea917afebbae521f1f33c680279f6172424e249b050a696f9283235210d30d19c4959d3139219979d57f8a01611ac9368a8dff9f7"' :
                                            'id="xs-controllers-links-module-CourseModule-7890376aed4053a2e3d941bea917afebbae521f1f33c680279f6172424e249b050a696f9283235210d30d19c4959d3139219979d57f8a01611ac9368a8dff9f7"' }>
                                            <li class="link">
                                                <a href="controllers/CourseController.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >CourseController</a>
                                            </li>
                                        </ul>
                                    </li>
                                <li class="chapter inner">
                                    <div class="simple menu-toggler" data-bs-toggle="collapse" ${ isNormalMode ?
                                        'data-bs-target="#injectables-links-module-CourseModule-7890376aed4053a2e3d941bea917afebbae521f1f33c680279f6172424e249b050a696f9283235210d30d19c4959d3139219979d57f8a01611ac9368a8dff9f7"' : 'data-bs-target="#xs-injectables-links-module-CourseModule-7890376aed4053a2e3d941bea917afebbae521f1f33c680279f6172424e249b050a696f9283235210d30d19c4959d3139219979d57f8a01611ac9368a8dff9f7"' }>
                                        <span class="icon ion-md-arrow-round-down"></span>
                                        <span>Injectables</span>
                                        <span class="icon ion-ios-arrow-down"></span>
                                    </div>
                                    <ul class="links collapse" ${ isNormalMode ? 'id="injectables-links-module-CourseModule-7890376aed4053a2e3d941bea917afebbae521f1f33c680279f6172424e249b050a696f9283235210d30d19c4959d3139219979d57f8a01611ac9368a8dff9f7"' :
                                        'id="xs-injectables-links-module-CourseModule-7890376aed4053a2e3d941bea917afebbae521f1f33c680279f6172424e249b050a696f9283235210d30d19c4959d3139219979d57f8a01611ac9368a8dff9f7"' }>
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
                                            'data-bs-target="#controllers-links-module-LessonModule-826af50785ebcd09d0d3da55ec2a608a99f5a98b66538edca6071b95e51f88fa5e6d1e1ec83b5ced513b6e9a02e7b679c3ae77012f51284fff3f4b0966257d7c"' : 'data-bs-target="#xs-controllers-links-module-LessonModule-826af50785ebcd09d0d3da55ec2a608a99f5a98b66538edca6071b95e51f88fa5e6d1e1ec83b5ced513b6e9a02e7b679c3ae77012f51284fff3f4b0966257d7c"' }>
                                            <span class="icon ion-md-swap"></span>
                                            <span>Controllers</span>
                                            <span class="icon ion-ios-arrow-down"></span>
                                        </div>
                                        <ul class="links collapse" ${ isNormalMode ? 'id="controllers-links-module-LessonModule-826af50785ebcd09d0d3da55ec2a608a99f5a98b66538edca6071b95e51f88fa5e6d1e1ec83b5ced513b6e9a02e7b679c3ae77012f51284fff3f4b0966257d7c"' :
                                            'id="xs-controllers-links-module-LessonModule-826af50785ebcd09d0d3da55ec2a608a99f5a98b66538edca6071b95e51f88fa5e6d1e1ec83b5ced513b6e9a02e7b679c3ae77012f51284fff3f4b0966257d7c"' }>
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
                                        'data-bs-target="#injectables-links-module-LessonModule-826af50785ebcd09d0d3da55ec2a608a99f5a98b66538edca6071b95e51f88fa5e6d1e1ec83b5ced513b6e9a02e7b679c3ae77012f51284fff3f4b0966257d7c"' : 'data-bs-target="#xs-injectables-links-module-LessonModule-826af50785ebcd09d0d3da55ec2a608a99f5a98b66538edca6071b95e51f88fa5e6d1e1ec83b5ced513b6e9a02e7b679c3ae77012f51284fff3f4b0966257d7c"' }>
                                        <span class="icon ion-md-arrow-round-down"></span>
                                        <span>Injectables</span>
                                        <span class="icon ion-ios-arrow-down"></span>
                                    </div>
                                    <ul class="links collapse" ${ isNormalMode ? 'id="injectables-links-module-LessonModule-826af50785ebcd09d0d3da55ec2a608a99f5a98b66538edca6071b95e51f88fa5e6d1e1ec83b5ced513b6e9a02e7b679c3ae77012f51284fff3f4b0966257d7c"' :
                                        'id="xs-injectables-links-module-LessonModule-826af50785ebcd09d0d3da55ec2a608a99f5a98b66538edca6071b95e51f88fa5e6d1e1ec83b5ced513b6e9a02e7b679c3ae77012f51284fff3f4b0966257d7c"' }>
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
                                            'data-bs-target="#controllers-links-module-RegisterInstructorModule-16afe8eaef843f53c0ba899c4dd5af7c0b232a36b24c69ebca6a07746535f8cc9e44a64daedb55c13126e30c4fc0f3b14469db298637b6a0b9bb10db179a977d"' : 'data-bs-target="#xs-controllers-links-module-RegisterInstructorModule-16afe8eaef843f53c0ba899c4dd5af7c0b232a36b24c69ebca6a07746535f8cc9e44a64daedb55c13126e30c4fc0f3b14469db298637b6a0b9bb10db179a977d"' }>
                                            <span class="icon ion-md-swap"></span>
                                            <span>Controllers</span>
                                            <span class="icon ion-ios-arrow-down"></span>
                                        </div>
                                        <ul class="links collapse" ${ isNormalMode ? 'id="controllers-links-module-RegisterInstructorModule-16afe8eaef843f53c0ba899c4dd5af7c0b232a36b24c69ebca6a07746535f8cc9e44a64daedb55c13126e30c4fc0f3b14469db298637b6a0b9bb10db179a977d"' :
                                            'id="xs-controllers-links-module-RegisterInstructorModule-16afe8eaef843f53c0ba899c4dd5af7c0b232a36b24c69ebca6a07746535f8cc9e44a64daedb55c13126e30c4fc0f3b14469db298637b6a0b9bb10db179a977d"' }>
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
                                        'data-bs-target="#injectables-links-module-RegisterInstructorModule-16afe8eaef843f53c0ba899c4dd5af7c0b232a36b24c69ebca6a07746535f8cc9e44a64daedb55c13126e30c4fc0f3b14469db298637b6a0b9bb10db179a977d"' : 'data-bs-target="#xs-injectables-links-module-RegisterInstructorModule-16afe8eaef843f53c0ba899c4dd5af7c0b232a36b24c69ebca6a07746535f8cc9e44a64daedb55c13126e30c4fc0f3b14469db298637b6a0b9bb10db179a977d"' }>
                                        <span class="icon ion-md-arrow-round-down"></span>
                                        <span>Injectables</span>
                                        <span class="icon ion-ios-arrow-down"></span>
                                    </div>
                                    <ul class="links collapse" ${ isNormalMode ? 'id="injectables-links-module-RegisterInstructorModule-16afe8eaef843f53c0ba899c4dd5af7c0b232a36b24c69ebca6a07746535f8cc9e44a64daedb55c13126e30c4fc0f3b14469db298637b6a0b9bb10db179a977d"' :
                                        'id="xs-injectables-links-module-RegisterInstructorModule-16afe8eaef843f53c0ba899c4dd5af7c0b232a36b24c69ebca6a07746535f8cc9e44a64daedb55c13126e30c4fc0f3b14469db298637b6a0b9bb10db179a977d"' }>
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
                                            'data-bs-target="#controllers-links-module-ThreadModule-e13808384ba53a02377cf9c2db8012e4ee2ed9a460f4c70a509b6c7fef88be4457fb56c7d63fd8a0e4c07f73dcba6f3d21ecc74bd9789b3d642e0a6b36c81a1b"' : 'data-bs-target="#xs-controllers-links-module-ThreadModule-e13808384ba53a02377cf9c2db8012e4ee2ed9a460f4c70a509b6c7fef88be4457fb56c7d63fd8a0e4c07f73dcba6f3d21ecc74bd9789b3d642e0a6b36c81a1b"' }>
                                            <span class="icon ion-md-swap"></span>
                                            <span>Controllers</span>
                                            <span class="icon ion-ios-arrow-down"></span>
                                        </div>
                                        <ul class="links collapse" ${ isNormalMode ? 'id="controllers-links-module-ThreadModule-e13808384ba53a02377cf9c2db8012e4ee2ed9a460f4c70a509b6c7fef88be4457fb56c7d63fd8a0e4c07f73dcba6f3d21ecc74bd9789b3d642e0a6b36c81a1b"' :
                                            'id="xs-controllers-links-module-ThreadModule-e13808384ba53a02377cf9c2db8012e4ee2ed9a460f4c70a509b6c7fef88be4457fb56c7d63fd8a0e4c07f73dcba6f3d21ecc74bd9789b3d642e0a6b36c81a1b"' }>
                                            <li class="link">
                                                <a href="controllers/ThreadController.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >ThreadController</a>
                                            </li>
                                        </ul>
                                    </li>
                                <li class="chapter inner">
                                    <div class="simple menu-toggler" data-bs-toggle="collapse" ${ isNormalMode ?
                                        'data-bs-target="#injectables-links-module-ThreadModule-e13808384ba53a02377cf9c2db8012e4ee2ed9a460f4c70a509b6c7fef88be4457fb56c7d63fd8a0e4c07f73dcba6f3d21ecc74bd9789b3d642e0a6b36c81a1b"' : 'data-bs-target="#xs-injectables-links-module-ThreadModule-e13808384ba53a02377cf9c2db8012e4ee2ed9a460f4c70a509b6c7fef88be4457fb56c7d63fd8a0e4c07f73dcba6f3d21ecc74bd9789b3d642e0a6b36c81a1b"' }>
                                        <span class="icon ion-md-arrow-round-down"></span>
                                        <span>Injectables</span>
                                        <span class="icon ion-ios-arrow-down"></span>
                                    </div>
                                    <ul class="links collapse" ${ isNormalMode ? 'id="injectables-links-module-ThreadModule-e13808384ba53a02377cf9c2db8012e4ee2ed9a460f4c70a509b6c7fef88be4457fb56c7d63fd8a0e4c07f73dcba6f3d21ecc74bd9789b3d642e0a6b36c81a1b"' :
                                        'id="xs-injectables-links-module-ThreadModule-e13808384ba53a02377cf9c2db8012e4ee2ed9a460f4c70a509b6c7fef88be4457fb56c7d63fd8a0e4c07f73dcba6f3d21ecc74bd9789b3d642e0a6b36c81a1b"' }>
                                        <li class="link">
                                            <a href="injectables/PrismaService.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >PrismaService</a>
                                        </li>
                                        <li class="link">
                                            <a href="injectables/ThreadService.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >ThreadService</a>
                                        </li>
                                    </ul>
                                </li>
                            </li>
                            <li class="link">
                                <a href="modules/UploadModule.html" data-type="entity-link" >UploadModule</a>
                                <li class="chapter inner">
                                    <div class="simple menu-toggler" data-bs-toggle="collapse" ${ isNormalMode ?
                                        'data-bs-target="#injectables-links-module-UploadModule-7faab54afbda22c714e29ef873112e23106ae597041cf713395e3450958a7825d3151395ead061ec3ded6bdec207ad62392d8f86327909abaa905d18048e78f0"' : 'data-bs-target="#xs-injectables-links-module-UploadModule-7faab54afbda22c714e29ef873112e23106ae597041cf713395e3450958a7825d3151395ead061ec3ded6bdec207ad62392d8f86327909abaa905d18048e78f0"' }>
                                        <span class="icon ion-md-arrow-round-down"></span>
                                        <span>Injectables</span>
                                        <span class="icon ion-ios-arrow-down"></span>
                                    </div>
                                    <ul class="links collapse" ${ isNormalMode ? 'id="injectables-links-module-UploadModule-7faab54afbda22c714e29ef873112e23106ae597041cf713395e3450958a7825d3151395ead061ec3ded6bdec207ad62392d8f86327909abaa905d18048e78f0"' :
                                        'id="xs-injectables-links-module-UploadModule-7faab54afbda22c714e29ef873112e23106ae597041cf713395e3450958a7825d3151395ead061ec3ded6bdec207ad62392d8f86327909abaa905d18048e78f0"' }>
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
                                <a href="modules/UserModule.html" data-type="entity-link" >UserModule</a>
                                    <li class="chapter inner">
                                        <div class="simple menu-toggler" data-bs-toggle="collapse" ${ isNormalMode ?
                                            'data-bs-target="#controllers-links-module-UserModule-7238a923a57dfb9285d83464c261c17a9e78b7ec748e379f2cc28138f5479f403adcd9bc1298a55520a44c59dc339d2073f85e43734b063bb312c8d5b2f4b107"' : 'data-bs-target="#xs-controllers-links-module-UserModule-7238a923a57dfb9285d83464c261c17a9e78b7ec748e379f2cc28138f5479f403adcd9bc1298a55520a44c59dc339d2073f85e43734b063bb312c8d5b2f4b107"' }>
                                            <span class="icon ion-md-swap"></span>
                                            <span>Controllers</span>
                                            <span class="icon ion-ios-arrow-down"></span>
                                        </div>
                                        <ul class="links collapse" ${ isNormalMode ? 'id="controllers-links-module-UserModule-7238a923a57dfb9285d83464c261c17a9e78b7ec748e379f2cc28138f5479f403adcd9bc1298a55520a44c59dc339d2073f85e43734b063bb312c8d5b2f4b107"' :
                                            'id="xs-controllers-links-module-UserModule-7238a923a57dfb9285d83464c261c17a9e78b7ec748e379f2cc28138f5479f403adcd9bc1298a55520a44c59dc339d2073f85e43734b063bb312c8d5b2f4b107"' }>
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
                                        'data-bs-target="#injectables-links-module-UserModule-7238a923a57dfb9285d83464c261c17a9e78b7ec748e379f2cc28138f5479f403adcd9bc1298a55520a44c59dc339d2073f85e43734b063bb312c8d5b2f4b107"' : 'data-bs-target="#xs-injectables-links-module-UserModule-7238a923a57dfb9285d83464c261c17a9e78b7ec748e379f2cc28138f5479f403adcd9bc1298a55520a44c59dc339d2073f85e43734b063bb312c8d5b2f4b107"' }>
                                        <span class="icon ion-md-arrow-round-down"></span>
                                        <span>Injectables</span>
                                        <span class="icon ion-ios-arrow-down"></span>
                                    </div>
                                    <ul class="links collapse" ${ isNormalMode ? 'id="injectables-links-module-UserModule-7238a923a57dfb9285d83464c261c17a9e78b7ec748e379f2cc28138f5479f403adcd9bc1298a55520a44c59dc339d2073f85e43734b063bb312c8d5b2f4b107"' :
                                        'id="xs-injectables-links-module-UserModule-7238a923a57dfb9285d83464c261c17a9e78b7ec748e379f2cc28138f5479f403adcd9bc1298a55520a44c59dc339d2073f85e43734b063bb312c8d5b2f4b107"' }>
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
                                    <a href="controllers/CourseController.html" data-type="entity-link" >CourseController</a>
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
                                <a href="classes/AddAnswerUserProgressDto.html" data-type="entity-link" >AddAnswerUserProgressDto</a>
                            </li>
                            <li class="link">
                                <a href="classes/AddExerciseLessonDto.html" data-type="entity-link" >AddExerciseLessonDto</a>
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
                                <a href="classes/AddUserProgressDto.html" data-type="entity-link" >AddUserProgressDto</a>
                            </li>
                            <li class="link">
                                <a href="classes/AddUserProgressNextDto.html" data-type="entity-link" >AddUserProgressNextDto</a>
                            </li>
                            <li class="link">
                                <a href="classes/AllReviewCourseDto.html" data-type="entity-link" >AllReviewCourseDto</a>
                            </li>
                            <li class="link">
                                <a href="classes/ContentLessonDto.html" data-type="entity-link" >ContentLessonDto</a>
                            </li>
                            <li class="link">
                                <a href="classes/CreateAttachmentDto.html" data-type="entity-link" >CreateAttachmentDto</a>
                            </li>
                            <li class="link">
                                <a href="classes/CreateChapterDto.html" data-type="entity-link" >CreateChapterDto</a>
                            </li>
                            <li class="link">
                                <a href="classes/CreateCourseDto.html" data-type="entity-link" >CreateCourseDto</a>
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
                                <a href="classes/DeleteChapterDto.html" data-type="entity-link" >DeleteChapterDto</a>
                            </li>
                            <li class="link">
                                <a href="classes/DeleteCourseDto.html" data-type="entity-link" >DeleteCourseDto</a>
                            </li>
                            <li class="link">
                                <a href="classes/DeleteLessonDto.html" data-type="entity-link" >DeleteLessonDto</a>
                            </li>
                            <li class="link">
                                <a href="classes/DeleteReplyDto.html" data-type="entity-link" >DeleteReplyDto</a>
                            </li>
                            <li class="link">
                                <a href="classes/DeleteReviewDto.html" data-type="entity-link" >DeleteReviewDto</a>
                            </li>
                            <li class="link">
                                <a href="classes/DetailQuizzDto.html" data-type="entity-link" >DetailQuizzDto</a>
                            </li>
                            <li class="link">
                                <a href="classes/DetailRegisterInstructorDto.html" data-type="entity-link" >DetailRegisterInstructorDto</a>
                            </li>
                            <li class="link">
                                <a href="classes/EmailProcessor.html" data-type="entity-link" >EmailProcessor</a>
                            </li>
                            <li class="link">
                                <a href="classes/FilterCourseDto.html" data-type="entity-link" >FilterCourseDto</a>
                            </li>
                            <li class="link">
                                <a href="classes/FindChapterDto.html" data-type="entity-link" >FindChapterDto</a>
                            </li>
                            <li class="link">
                                <a href="classes/GetAllExerciseDto.html" data-type="entity-link" >GetAllExerciseDto</a>
                            </li>
                            <li class="link">
                                <a href="classes/GetCourseBySlugDto.html" data-type="entity-link" >GetCourseBySlugDto</a>
                            </li>
                            <li class="link">
                                <a href="classes/GetCourseUserDto.html" data-type="entity-link" >GetCourseUserDto</a>
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
                                <a href="classes/GetUserProgressDto.html" data-type="entity-link" >GetUserProgressDto</a>
                            </li>
                            <li class="link">
                                <a href="classes/GetUserProgressQuizDto.html" data-type="entity-link" >GetUserProgressQuizDto</a>
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
                                <a href="classes/NewUserDto.html" data-type="entity-link" >NewUserDto</a>
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
                                <a href="classes/SetPasswordDto.html" data-type="entity-link" >SetPasswordDto</a>
                            </li>
                            <li class="link">
                                <a href="classes/SocketIOAdapter.html" data-type="entity-link" >SocketIOAdapter</a>
                            </li>
                            <li class="link">
                                <a href="classes/UpdateAvatarRequestDto.html" data-type="entity-link" >UpdateAvatarRequestDto</a>
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
                                <a href="classes/UpdateProgressExerciseDto.html" data-type="entity-link" >UpdateProgressExerciseDto</a>
                            </li>
                            <li class="link">
                                <a href="classes/UpdateQuizzDto.html" data-type="entity-link" >UpdateQuizzDto</a>
                            </li>
                            <li class="link">
                                <a href="classes/UpdateRoleDto.html" data-type="entity-link" >UpdateRoleDto</a>
                            </li>
                            <li class="link">
                                <a href="classes/UpdateRoleUserSuccess.html" data-type="entity-link" >UpdateRoleUserSuccess</a>
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
                                <a href="classes/UpdateValueCourse.html" data-type="entity-link" >UpdateValueCourse</a>
                            </li>
                            <li class="link">
                                <a href="classes/UploadGateway.html" data-type="entity-link" >UploadGateway</a>
                            </li>
                            <li class="link">
                                <a href="classes/UploadProcessor.html" data-type="entity-link" >UploadProcessor</a>
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
                                    <a href="injectables/CourseService.html" data-type="entity-link" >CourseService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/ExerciseService.html" data-type="entity-link" >ExerciseService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/LessonService.html" data-type="entity-link" >LessonService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/MailingService.html" data-type="entity-link" >MailingService</a>
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
                                <a href="interfaces/AttachmentServiceInterface.html" data-type="entity-link" >AttachmentServiceInterface</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/AuthServiceInterface.html" data-type="entity-link" >AuthServiceInterface</a>
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
                                <a href="interfaces/CourseResponse.html" data-type="entity-link" >CourseResponse</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/CourseServiceInterface.html" data-type="entity-link" >CourseServiceInterface</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/ExerciseResponse.html" data-type="entity-link" >ExerciseResponse</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/ExerciseServiceInterface.html" data-type="entity-link" >ExerciseServiceInterface</a>
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
                                <a href="interfaces/UpdateAvatarDto.html" data-type="entity-link" >UpdateAvatarDto</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/UpdatePictureCourse.html" data-type="entity-link" >UpdatePictureCourse</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/UpdateThumbnailVideo.html" data-type="entity-link" >UpdateThumbnailVideo</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/UpdateVideoLesson.html" data-type="entity-link" >UpdateVideoLesson</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/UploadFileDto.html" data-type="entity-link" >UploadFileDto</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/UploadServiceInterface.html" data-type="entity-link" >UploadServiceInterface</a>
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