
<a href="https://www.typescriptlang.org/">
  <img
    src="https://avatars.githubusercontent.com/u/189666396?s=150&u=9d55b1eb4ce258974ead76bf07ccf49ef0eb0ea7&v=4"
    title="typescript-package/wrap-property - A lightweight TypeScript package with for wrapping object properties."
  />
</a>

## typescript-package/wrap-property

<!-- npm badge -->
[![npm version][typescript-package-npm-badge-svg]][typescript-package-npm-badge]
[![GitHub issues][typescript-package-badge-issues]][typescript-package-issues]
[![GitHub license][typescript-package-badge-license]][typescript-package-license]

A **lightweight** TypeScript package with for wrapping object properties.

## Table of contents

- [Installation](#installation)
- [Api](#api)
  - [`WrapProperty`](#wrapproperty)
- [Contributing](#contributing)
- [Support](#support)
- [Code of Conduct](#code-of-conduct)
- [Git](#git)
  - [Commit](#commit)
  - [Versioning](#versioning)
- [License](#license)

## Installation

```bash
npm install @typescript-package/wrap-property --save-peer
```

## Api

```typescript
import {
  // Class.
  WrapProperty,     // Concrete class to wrap the property.

  // Abstract.
  WrapPropertyBase, // Foundational class for extension.
  WrapPropertyCore, // The abstraction for base.
} from '@typescript-package/wrap-property';
```

### Exports

- `WrapProperty` — Concrete class for wrapping properties on objects/classes.
- `WrapPropertyBase` — Base abstraction to extend for custom wrappers.
- `WrapPropertyCore` — The core abstraction.

### `WrapProperty` Constructor

```typescript
new WrapProperty(target, key, descriptor?)
```

- `target`: The object or class whose property is to be wrapped.
- `key`: The property key.
- `descriptor` (optional): Options such as `onGet`, `onSet`, `privateKey`, `configurable`, and `enumerable`.

---

### `WrapProperty`

### Usage

### 1. Basic Property Wrapping

This example demonstrates how to intercept reads and writes for a property.

```typescript
import { WrapProperty } from '@typescript-package/wrap-property';

class Example {
  public value = 1;
}

// Wrap the "value" property to log whenever it is accessed or set.
new WrapProperty(
  Example.prototype,
  'value',
  {
    onGet(key, value) {
      console.log(`Getting "${String(key)}":`, value);
      return value;
    },
    onSet(newValue, oldValue, key) {
      console.log(`Setting "${String(key)}":`, oldValue, '→', newValue);
      return newValue;
    },
  }
);

const ex = new Example();
ex.value = 42; // Logs: Setting "value": 1 → 42
console.log(ex.value); // Logs: Getting "value": 42
```

### 2. Wrapping a Property on a Class Constructor

You can pass a class constructor to wrap its prototype property:

```typescript
import { WrapProperty } from '@typescript-package/wrap-property';

class MyClass {
  myProp = 'hello';
}

new WrapProperty(MyClass, 'myProp', {
  onGet(key, value) {
    console.log(`Accessed ${String(key)}`);
    return value;
  }
});

const inst = new MyClass();
console.log(inst.myProp); // Logs: Accessed myProp
```

### 3. Customizing with WrapPropertyBase

You can extend `WrapPropertyBase` to implement your own custom behavior:

```typescript
import { WrapPropertyBase } from '@typescript-package/wrap-property';

class CustomLogger extends WrapPropertyBase<typeof obj, typeof obj, 'someKey'> {
  protected wrap(object, key, descriptor) {
    return super.wrap(object, key, {
      ...descriptor,
      onGet: (k, v) => {
        console.log(`Custom get for ${String(k)}: ${v}`);
        return v;
      }
    });
  }
}

const obj = { someKey: 123 };

new CustomLogger(obj, 'someKey');
console.log(obj.someKey); // Logs: Custom get for someKey: 123
```

## Contributing

Your contributions are valued! If you'd like to contribute, please feel free to submit a pull request. Help is always appreciated.

## Support

If you find this package useful and would like to support its and general development, you can contribute through one of the following payment methods. Your support helps maintain the packages and continue adding new.

Support via:

- [Stripe](https://donate.stripe.com/dR614hfDZcJE3wAcMM)
- [Revolut](https://checkout.revolut.com/pay/048b10a3-0e10-42c8-a917-e3e9cb4c8e29)
- [GitHub](https://github.com/sponsors/angular-package/sponsorships?sponsor=sciborrudnicki&tier_id=83618)
- [DonorBox](https://donorbox.org/become-a-sponsor-to-the-angular-package?default_interval=o)
- [Patreon](https://www.patreon.com/checkout/angularpackage?rid=0&fan_landing=true&view_as=public)

or via Trust Wallet

- [XLM](https://link.trustwallet.com/send?coin=148&address=GAFFFB7H3LG42O6JA63FJDRK4PP4JCNEOPHLGLLFH625X2KFYQ4UYVM4)
- [USDT (BEP20)](https://link.trustwallet.com/send?coin=20000714&address=0xA0c22A2bc7E37C1d5992dFDFFeD5E6f9298E1b94&token_id=0x55d398326f99059fF775485246999027B3197955)
- [ETH](https://link.trustwallet.com/send?coin=60&address=0xA0c22A2bc7E37C1d5992dFDFFeD5E6f9298E1b94)
- [BTC](https://link.trustwallet.com/send?coin=0&address=bc1qnf709336tfl57ta5mfkf4t9fndhx7agxvv9svn)
- [BNB](https://link.trustwallet.com/send?coin=20000714&address=0xA0c22A2bc7E37C1d5992dFDFFeD5E6f9298E1b94)

## Code of Conduct

By participating in this project, you agree to follow **[Code of Conduct](https://www.contributor-covenant.org/version/2/1/code_of_conduct/)**.

## GIT

### Commit

- [AngularJS Git Commit Message Conventions][git-commit-angular]
- [Karma Git Commit Msg][git-commit-karma]
- [Conventional Commits][git-commit-conventional]

### Versioning

[Semantic Versioning 2.0.0][git-semver]

**Given a version number MAJOR.MINOR.PATCH, increment the:**

- MAJOR version when you make incompatible API changes,
- MINOR version when you add functionality in a backwards-compatible manner, and
- PATCH version when you make backwards-compatible bug fixes.

Additional labels for pre-release and build metadata are available as extensions to the MAJOR.MINOR.PATCH format.

**FAQ**
How should I deal with revisions in the 0.y.z initial development phase?

> The simplest thing to do is start your initial development release at 0.1.0 and then increment the minor version for each subsequent release.

How do I know when to release 1.0.0?

> If your software is being used in production, it should probably already be 1.0.0. If you have a stable API on which users have come to depend, you should be 1.0.0. If you’re worrying a lot about backwards compatibility, you should probably already be 1.0.0.

## License

MIT © typescript-package ([license][typescript-package-license])

<!-- This package: typescript-package  -->
  <!-- GitHub: badges -->
  [typescript-package-badge-issues]: https://img.shields.io/github/issues/typescript-package/wrap-property
  [typescript-package-badge-forks]: https://img.shields.io/github/forks/typescript-package/wrap-property
  [typescript-package-badge-stars]: https://img.shields.io/github/stars/typescript-package/wrap-property
  [typescript-package-badge-license]: https://img.shields.io/github/license/typescript-package/wrap-property
  <!-- GitHub: badges links -->
  [typescript-package-issues]: https://github.com/typescript-package/wrap-property/issues
  [typescript-package-forks]: https://github.com/typescript-package/wrap-property/network
  [typescript-package-license]: https://github.com/typescript-package/wrap-property/blob/master/LICENSE
  [typescript-package-stars]: https://github.com/typescript-package/wrap-property/stargazers
<!-- This package -->

<!-- Package: typescript-package -->
  <!-- npm -->
  [typescript-package-npm-badge-svg]: https://badge.fury.io/js/@typescript-package%2Fwrap-property.svg
  [typescript-package-npm-badge]: https://badge.fury.io/js/@typescript-package%2Fwrap-property

<!-- GIT -->
[git-semver]: http://semver.org/

<!-- GIT: commit -->
[git-commit-angular]: https://gist.github.com/stephenparish/9941e89d80e2bc58a153
[git-commit-karma]: http://karma-runner.github.io/0.10/dev/git-commit-msg.html
[git-commit-conventional]: https://www.conventionalcommits.org/en/v1.0.0/
