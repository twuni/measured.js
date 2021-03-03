import { describe, it } from 'mocha';

import { expect } from 'chai';
import { fake } from 'sinon';
import measured from '.';

describe('#measured()', () => {
  describe('when given an id', () => {
    it('includes that id in its measurement', async () => {
      const onComplete = fake();
      const behavior = fake();
      await measured(behavior, { id: 'CrabSalad', onComplete });
      expect(onComplete.getCall(0).args[0]).to.have.property('id', 'CrabSalad');
    });
  });

  describe('when nested within another measured block', () => {
    it('invokes the onComplete callback of the outer block', async () => {
      const inner = fake();
      const outer = fake();
      const behavior = fake();

      await measured(async () => {
        await measured(behavior, { onComplete: inner });
      }, { onComplete: outer });

      expect(outer).to.have.been.calledOnce;
    });

    it('invokes the onComplete callback of the inner block', async () => {
      const inner = fake();
      const outer = fake();
      const behavior = fake();

      await measured(async () => {
        await measured(behavior, { onComplete: inner });
      }, { onComplete: outer });

      expect(inner).to.have.been.calledOnce;
    });
  });

  it('resolves to the wrapped resolution', () => {
    const result = 'the wrapped resolution';
    const behavior = fake.returns(result);
    return expect(measured(behavior)).to.eventually.equal(result);
  });

  it('rejects with the wrapped rejection', () => {
    const error = new Error('the wrapped rejection');
    const behavior = fake.throws(error);
    return expect(measured(behavior)).to.be.rejectedWith(error);
  });

  describe('#onComplete()', () => {
    describe('when the wrapped behavior rejects', () => {
      it('is called once', async () => {
        const onComplete = fake();
        const behavior = fake.throws(new Error('the wrapped rejection'));
        try {
          await measured(behavior, { onComplete });
        } catch (ignore) {
          // We expect this to throw an error.
        }
        expect(onComplete).to.have.been.calledOnce;
      });
    });

    it('is called once', async () => {
      const onComplete = fake();
      const behavior = fake();
      await measured(behavior, { onComplete });
      expect(onComplete).to.have.been.calledOnce;
    });

    it('is given a startTime', async () => {
      const onComplete = fake();
      const behavior = fake();
      await measured(behavior, { onComplete });
      expect(onComplete.getCall(0).args[0]).to.have.property('startTime');
    });

    it('is given an endTime', async () => {
      const onComplete = fake();
      const behavior = fake();
      await measured(behavior, { onComplete });
      expect(onComplete.getCall(0).args[0]).to.have.property('endTime');
    });

    it('is given a duration', async () => {
      const onComplete = fake();
      const behavior = fake();
      await measured(behavior, { onComplete });
      expect(onComplete.getCall(0).args[0]).to.have.property('duration');
    });
  });

  describe('#onReject()', () => {
    describe('when the wrapped behavior resolves', () => {
      it('is not called', async () => {
        const onReject = fake();
        const behavior = fake();
        await measured(behavior, { onReject });
        expect(onReject).not.to.have.been.called;
      });
    });

    describe('when the wrapped behavior rejects', () => {
      it('is called once', async () => {
        const onReject = fake();
        const behavior = fake.throws(new Error('the wrapped rejection'));
        try {
          await measured(behavior, { onReject });
        } catch (ignore) {
          // We expect this to throw an error.
        }
        expect(onReject).to.have.been.calledOnce;
      });

      it('is given a startTime', async () => {
        const onReject = fake();
        const behavior = fake.throws(new Error('the wrapped rejection'));
        try {
          await measured(behavior, { onReject });
        } catch (ignore) {
          // We expect this to throw an error.
        }
        expect(onReject.getCall(0).args[0]).to.have.property('startTime');
      });

      it('is given an endTime', async () => {
        const onReject = fake();
        const behavior = fake.throws(new Error('the wrapped rejection'));
        try {
          await measured(behavior, { onReject });
        } catch (ignore) {
          // We expect this to throw an error.
        }
        expect(onReject.getCall(0).args[0]).to.have.property('endTime');
      });

      it('is given a duration', async () => {
        const onReject = fake();
        const behavior = fake.throws(new Error('the wrapped rejection'));
        try {
          await measured(behavior, { onReject });
        } catch (ignore) {
          // We expect this to throw an error.
        }
        expect(onReject.getCall(0).args[0]).to.have.property('duration');
      });
    });
  });

  describe('#onResolve()', () => {
    describe('when the wrapped behavior rejects', () => {
      it('is not called', async () => {
        const onResolve = fake();
        const behavior = fake.throws(new Error('the wrapped rejection'));
        try {
          await measured(behavior, { onResolve });
        } catch (ignore) {
          // We expect this to throw an error.
        }
        expect(onResolve).not.to.have.been.called;
      });
    });

    describe('when the wrapped behavior resolves', () => {
      it('is called once', async () => {
        const onResolve = fake();
        const behavior = fake();
        await measured(behavior, { onResolve });
        expect(onResolve).to.have.been.calledOnce;
      });

      it('is given a startTime', async () => {
        const onResolve = fake();
        const behavior = fake();
        await measured(behavior, { onResolve });
        expect(onResolve.getCall(0).args[0]).to.have.property('startTime');
      });

      it('is given an endTime', async () => {
        const onResolve = fake();
        const behavior = fake();
        await measured(behavior, { onResolve });
        expect(onResolve.getCall(0).args[0]).to.have.property('endTime');
      });

      it('is given a duration', async () => {
        const onResolve = fake();
        const behavior = fake();
        await measured(behavior, { onResolve });
        expect(onResolve.getCall(0).args[0]).to.have.property('duration');
      });
    });
  });
});
