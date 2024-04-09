
// 定义一个全局变量，用于存储需要注册的函数列表
let registeredFunctions = [];
let butterflyProperties = {};

// 定义一个全局变量，用于标识是否已经初始化完成
let isInitialized = false;

// 定义一个函数，用于执行注册的函数列表
function executeRegisteredFunctions() {
  registeredFunctions.forEach(func => {
    func();
  });
}

// 导出 documentFunction 装饰器函数
export function documentFunction() {
  // 返回一个装饰器函数，接收被装饰的目标对象、属性名和属性描述符
  return function(target, name, descriptor) {
    // 在装饰器函数中，获取被装饰的方法
    const originalMethod = descriptor.value;

    // 定义一个新的函数，该函数用于注册被装饰的方法到全局 butterfly对象中
    const registerFunction = function() {
      // 如果 sakura 对象不存在或者不是初始化状态，则将被装饰的方法添加到注册列表中
      if (!window.butterfly|| !isInitialized) {
        registeredFunctions.push(() => {
          originalMethod.call(target);
        });
      } else {
        // 否则，直接执行被装饰的方法
        originalMethod.call(target);
      }
    };

    // 返回修改后的属性描述符，将原始方法替换为新的注册函数
    return {
      ...descriptor,
      value: registerFunction
    };
  };
}

// 初始化函数，用于在加载完成时执行注册的函数列表
export function initializeDocumentFunctions() {
  // 设置初始化状态为 true
  isInitialized = true;
  // 执行注册的函数列表
  executeRegisteredFunctions();
}

//butterfly

function mountProperties() {
  Object.keys(butterflyProperties).forEach(key => {
    if (!(key in window.butterfly)) {
      window.butterfly[key] = butterflyProperties[key];
    }
  });
}

export const butterfly = {
  translate(key, defaultValue, options) {
    if (window.butterfly.$t) {
      return window.butterfly.$t(key, { defaultValue: defaultValue, ...options });
    }
    return defaultValue;
  },

  $localize(selector) {
    if (window.butterfly.$localize) {
      window.butterfly.$localize(selector);
    }
  },

  mountGlobalProperty(key, value) {
    const descriptor = Object.getOwnPropertyDescriptor(window.butterfly, `$${key}`);
    if (descriptor) {
      return;
    }
    Object.defineProperty(window.butterfly, `$${key}`, {
      value: value,
      writable: false,
      enumerable: false,
      configurable: false,
    });
  },

  initialize() {
    isInitialized = true;
    mountProperties();
  }
};

window.butterfly = butterfly;

butterfly.initialize();
