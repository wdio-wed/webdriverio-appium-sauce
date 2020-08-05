const SELECTORSA = {
    ANDROID: {
        ALERT_TITLE: '*//android.widget.TextView[@resource-id="android:id/alertTitle"]',
        ALERT_MESSAGE: '*//android.widget.TextView[@resource-id="android:id/message"]',
        ALERT_BUTTON: '*//android.widget.Button[@text="{BUTTON_TEXT}"]',
    },
    IOS: {
        ALERT: '-ios predicate string:type == \'XCUIElementTypeAlert\'',
    },
};

class NativeAlert {
    /**
     * Wait for the alert to exist
     */
    static waitForIsShown (isShown = true) {
        const selector = driver.isAndroid ? SELECTORSA.ANDROID.ALERT_TITLE : SELECTORSA.IOS.ALERT;
        $(selector).waitForExist({
            timeout: 11000,
            reverse: !isShown,
        });
    }

    /**
     * Press a button in a cross-platform way.
     *
     * IOS:
     *  iOS always has an accessibilityID so use the `~` in combination
     *  with the name of the button as shown on the screen
     * ANDROID:
     *  Use the text of the button, provide a string and it will automatically transform it to uppercase
     *  and click on the button
     *
     * @param {string} selector
     */
    static pressButton (selector) {
        const buttonSelector = driver.isAndroid
            ? SELECTORSA.ANDROID.ALERT_BUTTON.replace(/{BUTTON_TEXT}/, selector.toUpperCase())
            : `~${selector}`;
        $(buttonSelector).click();
    }

    /**
     * Get the alert text
     *
     * @return {string}
     */
    static text () {
        // return driver.getAlertText();
        if (driver.isIOS) {
            return driver.getAlertText();
        }

        return `${$(SELECTORSA.ANDROID.ALERT_TITLE).getText()}\n${$(SELECTORSA.ANDROID.ALERT_MESSAGE).getText()}`;
    }
}

class TabBar {
    static openHome () {
        $('~Home').click();
    }

    static openWebView () {
        $('~WebView').click();
    }

    static openLogin () {
        $('~Login').click();
    }

    static openForms () {
        $('~Forms').click();
    }

    static openSwipe () {
        $('~Swipe').click();
    }

    static waitForTabBarShown () {
        $('~Home').waitForDisplayed({
            timeout: 20000,
        });
    }
}

class AppScreen {
    constructor (selector) {
        this.selector = selector;
    }

    /**
     * Wait for the login screen to be visible
     *
     * @param {boolean} isShown
     * @return {boolean}
     */
    waitForIsShown (isShown = true) {
        return $(this.selector).waitForDisplayed({
            reverse: !isShown
        });
    }
}

const SELECTORS = {
    LOGIN_SCREEN: '~Login-screen',
    LOGIN_CONTAINER_BUTTON: '~button-login-container',
    SIGN_UP_CONTAINER_BUTTON: '~button-sign-up-container',
    LOGIN_BUTTON: '~button-LOGIN',
    SIGN_UP_BUTTON: '~button-SIGN UP',
    INPUT: '~input-email',
    PASSWORD: '~input-password',
    REPEAT_PASSWORD: '~input-repeat-password'
};

class LoginScreen extends AppScreen {
    constructor () {
        super(SELECTORS.LOGIN_SCREEN);
    }

    get loginContainerButon () {
        return $(SELECTORS.LOGIN_CONTAINER_BUTTON);
    }

    get signUpContainerButon () {
        return $(SELECTORS.SIGN_UP_CONTAINER_BUTTON);
    }

    get loginButton () {
        return $(SELECTORS.LOGIN_BUTTON);
    }

    get signUpButton () {
        return $(SELECTORS.SIGN_UP_BUTTON);
    }

    get email () {
        return $(SELECTORS.INPUT);
    }

    get password () {
        return $(SELECTORS.PASSWORD);
    }

    get repeatPassword () {
        return $(SELECTORS.REPEAT_PASSWORD);
    }

    get alert () {
        return NativeAlert;
    }
}


const loginScreen = new LoginScreen();

describe('WebdriverIO and Appium, when interacting with a login form,', () => {
    beforeEach(() => {
        TabBar.waitForTabBarShown(true);
        TabBar.openLogin();
        loginScreen.waitForIsShown(true);
    });

    it('should be able login successfully', () => {
        loginScreen.loginContainerButon.click();
        loginScreen.email.setValue('test@webdriver.io');
        loginScreen.password.setValue('Test1234!');

        if (driver.isKeyboardShown()) {
            driver.hideKeyboard();
        }
        loginScreen.loginButton.click();
        loginScreen.alert.waitForIsShown();
        expect(loginScreen.alert.text()).toEqual('Success\nYou are logged in!');

        loginScreen.alert.pressButton('OK');
        loginScreen.alert.waitForIsShown(false);
    });
});


