export const oneExecution = (func) => {
    var executed = false;

    return () => 
        {
            if (!executed) {
                executed = true;
                func ();
            }
        }
}